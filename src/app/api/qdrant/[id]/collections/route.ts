import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const configs = await readConfigs();

    const qdrantConn = configs.qdrant_connections.find((c) => c.id === id);
    if (!qdrantConn) {
      return NextResponse.json(
        { error: `Qdrant подключение с id "${id}" не найдено` },
        { status: 404 },
      );
    }

    const { createQdrantClient } = await import('@/lib/qdrant-client');
    const client = createQdrantClient(qdrantConn);
    try {
      const collections = await client.listCollections();
      return NextResponse.json(collections);
    } finally {
      client.close();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка получения списка коллекций: ${message}` }, { status: 500 });
  }
}
