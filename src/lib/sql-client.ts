import { Pool } from 'pg';
import type { PGConnectionConfig, ConnectionTestResult, AutocompleteMatch } from '@/lib/types/connection';

// ── testPGConnection ────────────────────────────────────────────────────────

export async function testPGConnection(config: PGConnectionConfig): Promise<ConnectionTestResult> {
  let pool: Pool | null = null;
  try {
    pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 10_000,
    });

    const start = performance.now();
    await pool.query('SELECT 1');
    const latency = Math.round(performance.now() - start);

    return { ok: true, latency };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Ошибка подключения PostgreSQL: ${msg}` };
  } finally {
    if (pool) await pool.end();
  }
}

// ── autocompleteFromPG ──────────────────────────────────────────────────────

/**
 * Sanitizes a table/column identifier to prevent SQL injection.
 * Only allows alphanumeric and underscore characters.
 */
function sanitizeIdentifier(id: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id)) {
    throw new Error(`Недопустимый идентификатор: ${id}`);
  }
  return `"${id}"`;
}

/**
 * Generates a human-readable label from the first 2-3 text fields in a row.
 */
function generateLabel(row: Record<string, unknown>): string {
  const parts: string[] =
    Object.entries(row)
      .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
      .filter(([k]) => {
        const lk = k.toLowerCase();
        return !lk.includes('id') && !lk.includes('uuid') && !lk.includes('created') && !lk.includes('updated') && !lk.includes('version');
      })
      .slice(0, 3)
      .map(([, v]) => String(v).trim())
      .filter(Boolean);

  return parts.join(' — ') || '—';
}

export async function autocompleteFromPG(
  config: PGConnectionConfig,
  params: {
    sectionKey: string;
    fieldKey: string;
    value: string;
    limit?: number;
  },
): Promise<AutocompleteMatch[]> {
  const { sectionKey, fieldKey, value, limit = 10 } = params;

  // Validate identifiers to prevent SQL injection
  const table = sanitizeIdentifier(sectionKey);
  const column = sanitizeIdentifier(fieldKey);

  let pool: Pool | null = null;
  try {
    pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 10_000,
    });

    // Parameterized query for the search value ($1 = value, $2 = limit)
    const query = `SELECT * FROM ${table} WHERE ${column} ILIKE $1 AND is_current_version = true LIMIT $2`;
    const result = await pool.query(query, [`%${value}%`, limit]);

    return result.rows.map((r) => ({
      row: r as Record<string, unknown>,
      label: generateLabel(r as Record<string, unknown>),
    }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Ошибка автозаполнения PostgreSQL: ${msg}`);
  } finally {
    if (pool) await pool.end();
  }
}
