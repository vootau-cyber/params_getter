import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { ConnectionConfigs, SQLConnectionConfig, QdrantConnectionConfig } from '@/lib/types/connection';

// ── Paths ────────────────────────────────────────────────────────────────────

const DATA_DIR = path.resolve('/home/z/my-project/data');
const CONFIG_FILE = path.join(DATA_DIR, 'connection-configs.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultConfigs(): ConnectionConfigs {
  return {
    sql_connections: [],
    qdrant_connections: [],
  };
}

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

// ── Core read/write ─────────────────────────────────────────────────────────

export async function readConfigs(): Promise<ConnectionConfigs> {
  await ensureDataDir();
  const configs = await readJsonFile<ConnectionConfigs>(CONFIG_FILE);
  if (!configs) return getDefaultConfigs();

  // Ensure all expected keys exist
  return {
    sql_connections: Array.isArray(configs.sql_connections) ? configs.sql_connections : [],
    qdrant_connections: Array.isArray(configs.qdrant_connections) ? configs.qdrant_connections : [],
  };
}

export async function writeConfigs(configs: ConnectionConfigs): Promise<void> {
  await ensureDataDir();
  await writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2), 'utf-8');
}

// ── SQL CRUD ─────────────────────────────────────────────────────────────────

export async function addSQLConnection(
  config: Omit<SQLConnectionConfig, 'id' | 'createdAt'>,
): Promise<SQLConnectionConfig> {
  const configs = await readConfigs();
  const newConn: SQLConnectionConfig = {
    ...config,
    id: `sql_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  configs.sql_connections.push(newConn);
  await writeConfigs(configs);
  return newConn;
}

// ── Qdrant CRUD ──────────────────────────────────────────────────────────────

export async function addQdrantConnection(
  config: Omit<QdrantConnectionConfig, 'id' | 'createdAt'>,
): Promise<QdrantConnectionConfig> {
  const configs = await readConfigs();
  const newConn: QdrantConnectionConfig = {
    ...config,
    id: `qdrant_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  configs.qdrant_connections.push(newConn);
  await writeConfigs(configs);
  return newConn;
}

// ── Generic update / delete ─────────────────────────────────────────────────

export async function updateConnection(
  id: string,
  updates: Partial<SQLConnectionConfig | QdrantConnectionConfig>,
): Promise<SQLConnectionConfig | QdrantConnectionConfig | null> {
  const configs = await readConfigs();

  const sqlIdx = configs.sql_connections.findIndex((c) => c.id === id);
  if (sqlIdx !== -1) {
    configs.sql_connections[sqlIdx] = {
      ...configs.sql_connections[sqlIdx],
      ...updates,
    } as SQLConnectionConfig;
    await writeConfigs(configs);
    return configs.sql_connections[sqlIdx];
  }

  const qdrantIdx = configs.qdrant_connections.findIndex((c) => c.id === id);
  if (qdrantIdx !== -1) {
    configs.qdrant_connections[qdrantIdx] = {
      ...configs.qdrant_connections[qdrantIdx],
      ...updates,
    } as QdrantConnectionConfig;
    await writeConfigs(configs);
    return configs.qdrant_connections[qdrantIdx];
  }

  return null;
}

export async function deleteConnection(id: string): Promise<boolean> {
  const configs = await readConfigs();

  const sqlIdx = configs.sql_connections.findIndex((c) => c.id === id);
  if (sqlIdx !== -1) {
    configs.sql_connections.splice(sqlIdx, 1);
    await writeConfigs(configs);
    return true;
  }

  const qdrantIdx = configs.qdrant_connections.findIndex((c) => c.id === id);
  if (qdrantIdx !== -1) {
    configs.qdrant_connections.splice(qdrantIdx, 1);
    await writeConfigs(configs);
    return true;
  }

  return false;
}
