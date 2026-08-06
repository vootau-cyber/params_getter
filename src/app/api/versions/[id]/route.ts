import { NextRequest, NextResponse } from 'next/server';
import { loadVersionData } from '@/lib/storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const versionId = Number(id);

    if (!Number.isInteger(versionId) || versionId < 1) {
      return NextResponse.json(
        { error: 'Invalid version id – must be a positive integer' },
        { status: 400 },
      );
    }

    const data = await loadVersionData(versionId);

    if (!data) {
      return NextResponse.json(
        { error: `Version ${versionId} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
