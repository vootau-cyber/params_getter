import { Pool } from 'pg';
import type { SQLConnectionConfig, SQLTableInfo, SQLQueryResult, ConnectionTestResult } from '@/lib/types/connection';

// ── Client interface ─────────────────────────────────────────────────────────

export interface SQLClient {
  testConnection(): Promise<ConnectionTestResult>;
  listTables(): Promise<SQLTableInfo[]>;
  describeTable(table: string): Promise<{ columns: string[] }>;
  queryTable(table: string, opts: { limit: number; offset: number }): Promise<SQLQueryResult>;
  close(): Promise<void>;
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function createSQLClient(config: SQLConnectionConfig): SQLClient {
  if (config.type === 'postgresql') {
    return createPostgreSQLClient(config);
  }
  return createMySQLClient(config);
}

// ── PostgreSQL implementation ────────────────────────────────────────────────

function createPostgreSQLClient(config: SQLConnectionConfig): SQLClient {
  let pool: Pool | null = null;

  function getPool(): Pool {
    if (!pool) {
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
    }
    return pool;
  }

  return {
    async testConnection(): Promise<ConnectionTestResult> {
      try {
        const p = getPool();
        const start = performance.now();
        await p.query('SELECT 1');
        const latency = Math.round(performance.now() - start);
        return { ok: true, latency };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { ok: false, error: `Ошибка подключения PostgreSQL: ${msg}` };
      }
    },

    async listTables(): Promise<SQLTableInfo[]> {
      try {
        const p = getPool();
        const result = await p.query(`
          SELECT
            t.table_name,
            COUNT(c.column_name) AS column_count,
            COALESCE((SELECT n_live_tup FROM pg_stat_user_tables WHERE relname = t.table_name), 0) AS row_count
          FROM information_schema.tables t
          JOIN information_schema.columns c
            ON c.table_schema = t.table_schema AND c.table_name = t.table_name
          WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
          GROUP BY t.table_name
          ORDER BY t.table_name
        `);
        return result.rows.map((r) => ({
          table_name: r.table_name as string,
          column_count: Number(r.column_count),
          row_count: Number(r.row_count),
        }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка получения списка таблиц PostgreSQL: ${msg}`);
      }
    },

    async describeTable(table: string): Promise<{ columns: string[] }> {
      try {
        const p = getPool();
        const result = await p.query(
          `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
          [table],
        );
        return { columns: result.rows.map((r) => r.column_name as string) };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка описания таблицы "${table}": ${msg}`);
      }
    },

    async queryTable(table: string, opts: { limit: number; offset: number }): Promise<SQLQueryResult> {
      const identifier = (id: string) => `"${id.replace(/"/g, '""')}"`;
      try {
        const p = getPool();

        // Count
        const countRes = await p.query(`SELECT COUNT(*)::int AS cnt FROM ${identifier(table)}`);
        const total_count = Number(countRes.rows[0].cnt);

        // Data
        const dataRes = await p.query(
          `SELECT * FROM ${identifier(table)} LIMIT $1 OFFSET $2`,
          [opts.limit, opts.offset],
        );

        const columns = dataRes.fields.map((f) => f.name);
        const rows = dataRes.rows.map((r) => r as Record<string, unknown>);

        return { columns, rows, total_count };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка запроса к таблице "${table}": ${msg}`);
      }
    },

    async close(): Promise<void> {
      if (pool) {
        await pool.end();
        pool = null;
      }
    },
  };
}

// ── MySQL implementation ──────────────────────────────────────────────────────

function createMySQLClient(config: SQLConnectionConfig): SQLClient {
  let conn: import('mysql2/promise').Connection | null = null;

  async function getConnection(): Promise<import('mysql2/promise').Connection> {
    if (!conn) {
      const mysql = await import('mysql2/promise');
      conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
      connectTimeout: 10_000,
    });
    }
    return conn;
  }

  return {
    async testConnection(): Promise<ConnectionTestResult> {
      try {
        const c = await getConnection();
        const start = performance.now();
        await c.query('SELECT 1');
        const latency = Math.round(performance.now() - start);
        return { ok: true, latency };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { ok: false, error: `Ошибка подключения MySQL: ${msg}` };
      }
    },

    async listTables(): Promise<SQLTableInfo[]> {
      try {
        const c = await getConnection();

        // Get tables from information_schema
        const [tables] = await c.query(
          `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE' ORDER BY table_name`,
        );

        const result: SQLTableInfo[] = [];
        for (const row of tables as { table_name: string }[]) {
          // Column count
          const [cols] = await c.query(
            `SELECT COUNT(*) AS cnt FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?`,
            [row.table_name],
          );
          // Row count from SHOW TABLE STATUS
          const [status] = await c.query(`SHOW TABLE STATUS LIKE ?`, [row.table_name]);
          const statusRow = status as { Rows: number | bigint }[];
          const rowCount = Number(statusRow[0]?.Rows ?? 0);

          result.push({
            table_name: row.table_name,
            column_count: Number((cols as { cnt: number }[])[0].cnt),
            row_count: rowCount,
          });
        }
        return result;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка получения списка таблиц MySQL: ${msg}`);
      }
    },

    async describeTable(table: string): Promise<{ columns: string[] }> {
      try {
        const c = await getConnection();
        const [cols] = await c.query(
          `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? ORDER BY ordinal_position`,
          [table],
        );
        return { columns: (cols as { column_name: string }[]).map((r) => r.column_name) };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка описания таблицы "${table}": ${msg}`);
      }
    },

    async queryTable(table: string, opts: { limit: number; offset: number }): Promise<SQLQueryResult> {
      const identifier = (id: string) => `\`${id.replace(/`/g, '``')}\``;
      try {
        const c = await getConnection();

        // Count
        const [countRows] = await c.query(`SELECT COUNT(*) AS cnt FROM ${identifier(table)}`);
        const total_count = Number((countRows as { cnt: number }[])[0].cnt);

        // Data
        const [dataRows] = await c.query(
          `SELECT * FROM ${identifier(table)} LIMIT ? OFFSET ?`,
          [opts.limit, opts.offset],
        );

        const rows = dataRows as Record<string, unknown>[];
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

        return { columns, rows, total_count };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка запроса к таблице "${table}": ${msg}`);
      }
    },

    async close(): Promise<void> {
      if (conn) {
        await conn.end();
        conn = null;
      }
    },
  };
}
