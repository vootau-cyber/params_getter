import { NextResponse } from 'next/server';
import { resetToSeed } from '@/lib/storage';

export async function POST() {
  try {
    await resetToSeed();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
