import { NextRequest, NextResponse } from 'next/server';
import { readConfigs } from '@/lib/connection-storage';
import { loadCurrentData } from '@/lib/storage';
import { getQdrantFieldKeys } from '@/lib/qdrant-field-mapper';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
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

    // Load current data and identify sections with qdrant_* fields
    const data = await loadCurrentData();
    const qdrantFieldKeys = getQdrantFieldKeys();

    const affectedSections: string[] = [];
    for (const sectionKey of Object.keys(data)) {
      const rows = data[sectionKey] as Record<string, unknown>[];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const hasQdrantFields = rows.some((row) =>
        qdrantFieldKeys.some((qf) => qf in row && row[qf] !== null && row[qf] !== ''),
      );
      if (hasQdrantFields) {
        affectedSections.push(sectionKey);
      }
    }

    return NextResponse.json({
      message: 'Автоматическая синхронизация полей qdrant_* требует настройки сервиса эмбеддингов. В текущей версии доступен ручной поиск через API поиска (POST /api/qdrant/[id]/search). Для автоматической синхронизации необходимо подключить embedding-сервис (например, OpenAI Embeddings или локальную модель) для преобразования текстовых данных в векторное представление.',
      affectedSections: affectedSections.length > 0
        ? affectedSections
        : 'Секции с заполненными qdrant_* полями не обнаружены в текущих данных.',
      affectedSectionsCount: affectedSections.length,
      hint: 'Для ручного заполнения полей qdrant_* используйте endpoint POST /api/qdrant/[id]/search для поиска по векторному представлению, затем обновите соответствующие записи через API данных.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка синхронизации с Qdrant: ${message}` }, { status: 500 });
  }
}
