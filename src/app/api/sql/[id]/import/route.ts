import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';
import { loadCurrentData, saveData } from '@/lib/storage';
import { getEmptyRow } from '@/lib/schema';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const configs = await readConfigs();

    const sqlConn = configs.sql_connections.find((c) => c.id === id);
    if (!sqlConn) {
      return NextResponse.json(
        { error: `SQL подключение с id "${id}" не найдено` },
        { status: 404 },
      );
    }

    const body = (await request.json()) as {
      table?: string;
      sectionKey?: string;
      mapping?: Record<string, string>;
    };

    if (!body.table || !body.sectionKey || !body.mapping) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля: table, sectionKey, mapping' },
        { status: 400 },
      );
    }

    if (typeof body.mapping !== 'object' || Array.isArray(body.mapping)) {
      return NextResponse.json(
        { error: 'Поле mapping должно быть объектом { sqlColumn: schemaField }' },
        { status: 400 },
      );
    }

    const { table, sectionKey, mapping } = body;

    // Verify the section exists in schema
    const emptyRow = getEmptyRow(sectionKey);
    if (Object.keys(emptyRow).length === 0) {
      return NextResponse.json(
        { error: `Секция "${sectionKey}" не найдена в схеме` },
        { status: 400 },
      );
    }

    // Load all rows from the SQL table
    const { createSQLClient } = await import('@/lib/sql-client');
    const client = createSQLClient(sqlConn);
    try {
      const result = await client.queryTable(table, { limit: 100_000, offset: 0 });

      // Load current data
      const currentData = await loadCurrentData();
      const sectionData = Array.isArray(currentData[sectionKey])
        ? [...(currentData[sectionKey] as Record<string, unknown>[])]
        : [];

      // Import each SQL row
      for (const sqlRow of result.rows) {
        const newRow = getEmptyRow(sectionKey);

        // Apply mapping: sqlColumn -> schemaField
        for (const [sqlCol, schemaField] of Object.entries(mapping)) {
          if (sqlRow[sqlCol] !== undefined && schemaField in newRow) {
            newRow[schemaField] = sqlRow[sqlCol];
          }
        }

        sectionData.push(newRow);
      }

      // Save data back
      currentData[sectionKey] = sectionData;
      await saveData(currentData, { name: 'Импорт SQL', role: 'system' });

      return NextResponse.json({ imported: result.rows.length });
    } finally {
      await client.close();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка импорта данных: ${message}` }, { status: 500 });
  }
}
