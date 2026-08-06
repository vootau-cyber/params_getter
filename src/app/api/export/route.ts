import { NextResponse } from 'next/server';
import { exportJson } from '@/lib/storage';

export async function GET() {
  try {
    const json = await exportJson();
    return new NextResponse(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="port_security_data.json"',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
