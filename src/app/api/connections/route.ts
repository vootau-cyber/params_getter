import { NextRequest, NextResponse } from 'next/server';
import { readConfigs, addSQLConnection, addQdrantConnection } from '@/lib/connection-storage';

export async function GET() {
  try {
    const configs = await readConfigs();
    return NextResponse.json(configs);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка загрузки конфигураций: ${message}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: string;
      [key: string]: unknown;
    };

    if (!body.type || (body.type !== 'sql' && body.type !== 'qdrant')) {
      return NextResponse.json(
        { error: 'Тип подключения должен быть "sql" или "qdrant"' },
        { status: 400 },
      );
    }

    if (body.type === 'sql') {
      const { name, dbType, host, port, database, username, password, ssl } = body;
      if (!name || !dbType || !host || !port || !database || !username) {
        return NextResponse.json(
          { error: 'Отсутствуют обязательные поля для SQL подключения (name, dbType, host, port, database, username)' },
          { status: 400 },
        );
      }
      const conn = await addSQLConnection({
        name: String(name),
        type: dbType === 'mysql' ? 'mysql' : 'postgresql',
        host: String(host),
        port: Number(port),
        database: String(database),
        username: String(username),
        password: String(password ?? ''),
        ssl: Boolean(ssl),
      });
      return NextResponse.json(conn, { status: 201 });
    }

    // Qdrant
    const { name, url, apiKey, collection } = body;
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля для Qdrant подключения (name, url)' },
        { status: 400 },
      );
    }
    const conn = await addQdrantConnection({
      name: String(name),
      url: String(url),
      apiKey: String(apiKey ?? ''),
      collection: String(collection ?? ''),
    });
    return NextResponse.json(conn, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: `Ошибка создания подключения: ${message}` }, { status: 500 });
  }
}
