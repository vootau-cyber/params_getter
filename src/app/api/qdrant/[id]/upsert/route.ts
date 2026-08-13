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
      points?: Array<{ id: string; vector: number[]; payload: Record<string, unknown> }>;
    };

    const collection = body.collection || qdrantConn.collection;
    if (!collection) {
      return NextResponse.json(
        { error: 'Не указана коллекция. Укажите коллекцию в запросе или в настройках подключения.' },
        { status: 400 },
      );
    }

    if (!body.points || !Array.isArray(body.points) || body.points.length === 0) {
      return NextResponse.json(
        { error: 'Необходимо указать массив points для добавления' },
        { status: 400 },
      );
    }

    // Validate each point has required fields
    for (const point of body.points) {
      if (!point.id || !point.vector || !Array.isArray(point.vector)) {
        return NextResponse.json(
          { error: 'Каждая точка должна содержать id (строка), vector (числовой массив) и payload (объект)' },
          { status: 400 },
        );
      }
    }

    const { createQdrantClient } = await import('@/lib/qdrant-client');
    const client = createQdrantClient(qdrantConn);
    try {
      const count = await client.upsert(collection, body.points);
      return NextResponse.json({ upserted: count });
    } finally {
      client.close();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка добавления точек в Qdrant: ${message}` }, { status: 500 });
  }
}
