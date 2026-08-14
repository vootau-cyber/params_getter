import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { ConnectionConfigs, PGConnectionConfig, QdrantConfig } from '@/lib/types/connection';

// ── Paths ────────────────────────────────────────────────────────────────────

const DATA_DIR = path.resolve('/home/z/my-project/data');
const CONFIG_FILE = path.join(DATA_DIR, 'connection-configs.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultConfigs(): ConnectionConfigs {
  return {
    postgresql: null,
    qdrant: null,
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

// ── Core ─────────────────────────────────────────────────────────────────────

export async function readConfigs(): Promise<ConnectionConfigs> {
  await ensureDataDir();
  const configs = await readJsonFile<ConnectionConfigs>(CONFIG_FILE);
  if (!configs) return getDefaultConfigs();
  return {
    postgresql: configs.postgresql ?? null,
    qdrant: configs.qdrant ?? null,
  };
}

async function writeConfigs(configs: ConnectionConfigs): Promise<void> {
  await ensureDataDir();
  await writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2), 'utf-8');
}

// ── PG ───────────────────────────────────────────────────────────────────────

export async function savePGConfig(config: PGConnectionConfig): Promise<void> {
  const configs = await readConfigs();
  configs.postgresql = config;
  await writeConfigs(configs);
}

export async function clearPGConfig(): Promise<void> {
  const configs = await readConfigs();
  configs.postgresql = null;
  await writeConfigs(configs);
}

// ── Qdrant ───────────────────────────────────────────────────────────────────

export async function saveQdrantConfig(config: QdrantConfig): Promise<void> {
  const configs = await readConfigs();
  configs.qdrant = config;
  await writeConfigs(configs);
}

export async function clearQdrantConfig(): Promise<void> {
  const configs = await readConfigs();
  configs.qdrant = null;
  await writeConfigs(configs);
}
