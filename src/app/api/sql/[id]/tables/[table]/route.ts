import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';

type RouteContext = { params: Promise<{ id: string; table: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id, table } = await context.params;
    const configs = await readConfigs();

    const sqlConn = configs.sql_connections.find((c) => c.id === id);
    if (!sqlConn) {
      return NextResponse.json(
        { error: `SQL подключение с id "${id}" не найдено` },
        { status: 404 },
      );
    }

    // Parse limit/offset from query string
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 1000);
    const offset = Number(searchParams.get('offset')) || 0;

    const { createSQLClient } = await import('@/lib/sql-client');
    const client = createSQLClient(sqlConn);
    try {
      const [describeResult, queryResult] = await Promise.all([
        client.describeTable(table),
        client.queryTable(table, { limit, offset }),
      ]);

      return NextResponse.json({
        columns: describeResult.columns,
        rows: queryResult.rows,
        total_count: queryResult.total_count,
      });
    } finally {
      await client.close();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка чтения таблицы: ${message}` }, { status: 500 });
  }
}
