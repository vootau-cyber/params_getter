import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
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

    const { createSQLClient } = await import('@/lib/sql-client');
    const client = createSQLClient(sqlConn);
    try {
      const tables = await client.listTables();
      return NextResponse.json(tables);
    } finally {
      await client.close();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка получения списка таблиц: ${message}` }, { status: 500 });
  }
}
