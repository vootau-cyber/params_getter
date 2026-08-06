import { NextResponse } from 'next/server';
import { getVersions } from '@/lib/storage';

export async function GET() {
  try {
    const versions = await getVersions();
    return NextResponse.json(versions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
