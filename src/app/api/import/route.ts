import { NextRequest, NextResponse } from 'next/server';
import { loadCurrentData, saveData } from '@/lib/storage';
import type { DomainData } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded. Provide a file under the "file" key.' },
        { status: 400 },
      );
    }

    if (!file.name.endsWith('.json')) {
      return NextResponse.json(
        { error: 'Uploaded file must be a .json file' },
        { status: 400 },
      );
    }

    const raw = await file.text();
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON – could not parse the file' },
        { status: 400 },
      );
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json(
        { error: 'JSON must be an object with section keys' },
        { status: 400 },
      );
    }

    const imported = parsed as Record<string, unknown>;

    // Validate structure – current data section keys
    const currentData = await loadCurrentData();
    const expectedKeys = new Set(Object.keys(currentData));
    const importedKeys = new Set(Object.keys(imported));

    // Allow a superset of keys (may have extra keys), but require at least the
    // expected section keys to be present.
    const missingKeys: string[] = [];
    for (const k of expectedKeys) {
      if (!importedKeys.has(k)) missingKeys.push(k);
    }

    if (missingKeys.length > 0) {
      return NextResponse.json(
        { error: `Missing required sections: ${missingKeys.join(', ')}` },
        { status: 400 },
      );
    }

    // Save as current data (author is "Импорт")
    const result = await saveData(imported as DomainData, {
      name: 'Импорт',
      role: 'system',
    });

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
