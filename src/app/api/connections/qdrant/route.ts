import { NextRequest, NextResponse } from 'next/server';
import { readConfigs, saveQdrantConfig, clearQdrantConfig } from '@/lib/connection-storage';
import type { QdrantConfig } from '@/lib/types/connection';

export async function GET() {
  try {
    const configs = await readConfigs();
    return NextResponse.json({ qdrant: configs.qdrant });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка загрузки: ${message}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as QdrantConfig;

    if (!body.url) {
      return NextResponse.json(
        { error: 'Отсутствует обязательное поле (url)' },
        { status: 400 },
      );
    }

    await saveQdrantConfig({
      url: String(body.url),
      apiKey: String(body.apiKey ?? ''),
      collection: String(body.collection ?? ''),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка сохранения: ${message}` }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearQdrantConfig();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка очистки: ${message}` }, { status: 500 });
  }
}
