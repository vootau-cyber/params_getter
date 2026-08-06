import { NextRequest, NextResponse } from 'next/server';
import { loadCurrentData, saveData } from '@/lib/storage';
import type { DomainData } from '@/lib/storage';

export async function GET() {
  try {
    const data = await loadCurrentData();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      data?: DomainData;
      author?: { name: string; role: string };
    };

    if (!body.data || typeof body.data !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid "data" field' },
        { status: 400 },
      );
    }

    if (
      !body.author ||
      typeof body.author.name !== 'string' ||
      typeof body.author.role !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid "author" field (requires name and role)' },
        { status: 400 },
      );
    }

    const result = await saveData(body.data, body.author);
    return NextResponse.json({
      success: true,
      version: result.version,
      timestamp: result.timestamp,
      changed_sections: result.changed_sections,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
