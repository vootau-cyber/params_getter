import { NextRequest, NextResponse } from 'next/server';
import { readConfigs, writeConfigs, deleteConnection, updateConnection } from '@/lib/connection-storage';
import type { SQLConnectionConfig, QdrantConnectionConfig } from '@/lib/types/connection';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const configs = await readConfigs();

    const sqlConn = configs.sql_connections.find((c) => c.id === id);
    if (sqlConn) return NextResponse.json(sqlConn);

    const qdrantConn = configs.qdrant_connections.find((c) => c.id === id);
    if (qdrantConn) return NextResponse.json(qdrantConn);

    return NextResponse.json(
      { error: `Подключение с id "${id}" не найдено` },
      { status: 404 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка загрузки подключения: ${message}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const configs = await readConfigs();

    const sqlIdx = configs.sql_connections.findIndex((c) => c.id === id);
    const qdrantIdx = configs.qdrant_connections.findIndex((c) => c.id === id);

    if (sqlIdx === -1 && qdrantIdx === -1) {
      return NextResponse.json(
        { error: `Подключение с id "${id}" не найдено` },
        { status: 404 },
      );
    }

    if (sqlIdx !== -1) {
      const existing = configs.sql_connections[sqlIdx] as SQLConnectionConfig;
      const updated = {
        ...existing,
        ...(body.name !== undefined ? { name: String(body.name) } : {}),
        ...(body.dbType !== undefined ? { type: body.dbType === 'mysql' ? 'mysql' : 'postgresql' } : {}),
        ...(body.host !== undefined ? { host: String(body.host) } : {}),
        ...(body.port !== undefined ? { port: Number(body.port) } : {}),
        ...(body.database !== undefined ? { database: String(body.database) } : {}),
        ...(body.username !== undefined ? { username: String(body.username) } : {}),
        ...(body.password !== undefined ? { password: String(body.password) } : {}),
        ...(body.ssl !== undefined ? { ssl: Boolean(body.ssl) } : {}),
      } as SQLConnectionConfig;
      configs.sql_connections[sqlIdx] = updated;
      await writeConfigs(configs);
      return NextResponse.json(updated);
    }

    const existing = configs.qdrant_connections[qdrantIdx] as QdrantConnectionConfig;
    const updated = {
      ...existing,
      ...(body.name !== undefined ? { name: String(body.name) } : {}),
      ...(body.url !== undefined ? { url: String(body.url) } : {}),
      ...(body.apiKey !== undefined ? { apiKey: String(body.apiKey) } : {}),
      ...(body.collection !== undefined ? { collection: String(body.collection) } : {}),
    } as QdrantConnectionConfig;
    configs.qdrant_connections[qdrantIdx] = updated;
    await writeConfigs(configs);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка обновления подключения: ${message}` }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const configs = await readConfigs();

    const exists =
      configs.sql_connections.some((c) => c.id === id) ||
      configs.qdrant_connections.some((c) => c.id === id);

    if (!exists) {
      return NextResponse.json(
        { error: `Подключение с id "${id}" не найдено` },
        { status: 404 },
      );
    }

    await deleteConnection(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка удаления подключения: ${message}` }, { status: 500 });
  }
}
