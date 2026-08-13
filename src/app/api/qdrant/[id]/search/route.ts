import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
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

    const body = (await request.json()) as {
      collection?: string;
      vector?: number[];
      query?: string;
      limit?: number;
      filter?: Record<string, unknown>;
    };

    const collection = body.collection || qdrantConn.collection;
    if (!collection) {
      return NextResponse.json(
        { error: 'Не указана коллекция для поиска. Укажите коллекцию в запросе или в настройках подключения.' },
        { status: 400 },
      );
    }

    // If query string is provided but no vector, return placeholder
    if (body.query && !body.vector) {
      return NextResponse.json({
        results: [],
        message: 'Поиск по текстовому запросу требует интеграции с сервисом эмбеддингов. Эта функция будет доступна после настройки embedding-сервиса.',
      });
    }

    if (!body.vector || !Array.isArray(body.vector) || body.vector.length === 0) {
      return NextResponse.json(
        { error: 'Необходимо указать вектор для поиска (поле vector)' },
        { status: 400 },
      );
    }

    const { createQdrantClient } = await import('@/lib/qdrant-client');
    const client = createQdrantClient(qdrantConn);
    try {
      const results = await client.search(collection, body.vector, {
        limit: body.limit ?? 10,
        filter: body.filter,
      });
      return NextResponse.json({ results });
    } finally {
      client.close();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка поиска в Qdrant: ${message}` }, { status: 500 });
  }
}
