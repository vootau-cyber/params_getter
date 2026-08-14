import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';
import { autocompleteFromPG } from '@/lib/sql-client';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      sectionKey?: string;
      fieldKey?: string;
      value?: string;
      limit?: number;
    };

    const { sectionKey, fieldKey, value, limit = 10 } = body;

    if (!sectionKey || !fieldKey || !value) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля (sectionKey, fieldKey, value)' },
        { status: 400 },
      );
    }

    const configs = await readConfigs();
    const pg = configs.postgresql;

    if (!pg) {
      return NextResponse.json(
        { error: 'Подключение PostgreSQL не настроено. Откройте настройки подключений.' },
        { status: 400 },
      );
    }

    const matches = await autocompleteFromPG(pg, {
      sectionKey,
      fieldKey,
      value,
      limit,
    });

    return NextResponse.json(matches);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
