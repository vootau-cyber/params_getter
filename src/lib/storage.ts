import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// ── Types ────────────────────────────────────────────────────────────────────

export interface VersionEntry {
  id: number;
  timestamp: string; // ISO string
  author_name: string;
  author_role: string;
  changed_sections: string[];
  version_label: string; // e.g. "Версия 1"
  data_file: string; // filename like "versions/v_1.json"
}

export type DomainData = Record<string, unknown[]>;

// ── Paths ────────────────────────────────────────────────────────────────────

const DATA_DIR = path.resolve('/home/z/my-project/data');
const CURRENT_FILE = path.join(DATA_DIR, 'current.json');
const VERSIONS_DIR = path.join(DATA_DIR, 'versions');
const VERSIONS_MANIFEST = path.join(DATA_DIR, 'versions.json');
const SEED_FILE = path.resolve('/home/z/my-project/upload/seed_domain_data_full.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Creates data/ and data/versions/ directories if they don't exist. */
export async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(VERSIONS_DIR, { recursive: true });
}

/** Reads and parses a JSON file, returns null on ENOENT. */
async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

/** Detects which top-level keys changed between two data snapshots. */
function detectChangedSections(oldData: DomainData, newData: DomainData): string[] {
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  const changed: string[] = [];

  for (const key of allKeys) {
    const oldJson = JSON.stringify(oldData[key] ?? []);
    const newJson = JSON.stringify(newData[key] ?? []);
    if (oldJson !== newJson) {
      changed.push(key);
    }
  }
  return changed;
}

/**
 * Ensures all current schema section keys exist in the data.
 * No more merging — each section is preserved as-is.
 */
export function migrateData(data: DomainData): DomainData {
  const migrated = { ...data };

  // If old "contracts" key exists from a previous version, split it back
  if (migrated['contracts'] && !migrated['ptb_contracts']) {
    const contracts = (migrated['contracts'] || []) as Record<string, unknown>[];
    const ptbContracts: unknown[] = [];
    const maintenanceContracts: unknown[] = [];

    for (const row of contracts) {
      if (row.contract_type === 'Техническое обслуживание' || row.contract_provider || row.contract_scope) {
        // Split back to maintenance_contracts format
        maintenanceContracts.push({
          oti_ref: row.oti_ref ?? null,
          ptb_ref: row.ptb_ref ?? null,
          contract_name: row.contract_name ?? '',
          contract_num: row.contract_num ?? '',
          contract_date: row.contract_date ?? null,
          contract_exp_date: row.contract_exp_date ?? null,
          contract_provider: row.contract_provider ?? '',
          contract_scope: row.contract_scope ?? '',
          contract_is_active: row.contract_is_active ?? true,
        });
      } else {
        // Split back to ptb_contracts format
        ptbContracts.push({
          ptb_ref: row.ptb_ref ?? null,
          contract_name: row.contract_name ?? '',
          contract_num: row.contract_num ?? '',
          contract_date: row.contract_date ?? null,
          contract_exp_date: row.contract_exp_date ?? null,
          is_prolonged: row.is_prolonged ?? false,
          prolongation_date: row.prolongation_date ?? null,
          prolongation_new_exp_date: row.prolongation_new_exp_date ?? null,
          contract_is_maintenance: row.contract_is_maintenance ?? false,
        });
      }
    }

    migrated['ptb_contracts'] = ptbContracts;
    migrated['maintenance_contracts'] = maintenanceContracts;
    delete migrated['contracts'];
  }

  // Ensure all current schema section keys exist
  const knownKeys = [
    'sti', 'sti_licenses', 'oti', 'persons', 'assessments', 'security_plans',
    'land', 'land_summary', 'aquatories', 'cargo', 'cargo_summary',
    'cargo_turnover', 'oti_operations', 'opo', 'infrastructure',
    'critical_elements', 'restricted_access_zones', 'zoning', 'ptb',
    'ptb_contracts', 'maintenance_contracts',
    'ptb_supplementary_agreements', 'posts', 'post_staff',
    'post_equipment', 'tsotb_catalog', 'tsotb_instances',
    'eng_catalog', 'eng_instances', 'climate_context',
  ];
  for (const key of knownKeys) {
    if (!migrated[key]) {
      migrated[key] = [];
    }
  }

  return migrated;
}

// ── Core functions ───────────────────────────────────────────────────────────

/**
 * Loads current data from data/current.json.
 * If the file doesn't exist, initialises from the seed template and returns it.
 */
export async function loadCurrentData(): Promise<DomainData> {
  await ensureDataDir();

  const existing = await readJsonFile<DomainData>(CURRENT_FILE);
  if (existing) return migrateData(existing);

  // Initialise from seed
  const seedRaw = await readFile(SEED_FILE, 'utf-8');
  const seed = JSON.parse(seedRaw) as DomainData;
  // Strip meta section — it's not part of the data schema
  delete (seed as Record<string, unknown>)['meta'];
  const migrated = migrateData(seed);
  await writeFile(CURRENT_FILE, JSON.stringify(migrated, null, 2), 'utf-8');
  return migrated;
}

/**
 * Saves current data, creates a version snapshot, appends to versions manifest.
 * Returns version metadata.
 */
export async function saveData(
  data: DomainData,
  author: { name: string; role: string },
): Promise<{ version: number; timestamp: string; changed_sections: string[] }> {
  await ensureDataDir();

  const oldData = await readJsonFile<DomainData>(CURRENT_FILE);
  const isFirstSave = oldData === null;
  const changedSections = isFirstSave
    ? Object.keys(data)
    : detectChangedSections(oldData, data);

  // ── Load / create versions manifest ──
  let versions = (await readJsonFile<VersionEntry[]>(VERSIONS_MANIFEST)) ?? [];
  const nextId = versions.length > 0 ? Math.max(...versions.map((v) => v.id)) + 1 : 1;

  const timestamp = new Date().toISOString();
  const versionEntry: VersionEntry = {
    id: nextId,
    timestamp,
    author_name: author.name,
    author_role: author.role,
    changed_sections: changedSections,
    version_label: `Версия ${nextId}`,
    data_file: `versions/v_${nextId}.json`,
  };

  // ── Write snapshot ──
  const snapshotPath = path.join(DATA_DIR, versionEntry.data_file);
  await writeFile(snapshotPath, JSON.stringify(data, null, 2), 'utf-8');

  // ── Append to manifest ──
  versions.push(versionEntry);
  await writeFile(VERSIONS_MANIFEST, JSON.stringify(versions, null, 2), 'utf-8');

  // ── Overwrite current ──
  await writeFile(CURRENT_FILE, JSON.stringify(data, null, 2), 'utf-8');

  return { version: nextId, timestamp, changed_sections: changedSections };
}

/** Returns list of all versions (metadata only). */
export async function getVersions(): Promise<VersionEntry[]> {
  await ensureDataDir();
  return (await readJsonFile<VersionEntry[]>(VERSIONS_MANIFEST)) ?? [];
}

/** Returns a specific version entry, or null if not found. */
export async function getVersion(versionId: number): Promise<VersionEntry | null> {
  const versions = await getVersions();
  return versions.find((v) => v.id === versionId) ?? null;
}

/** Loads the full data snapshot for a given version id. */
export async function loadVersionData(versionId: number): Promise<DomainData | null> {
  const entry = await getVersion(versionId);
  if (!entry) return null;

  const snapshotPath = path.join(DATA_DIR, entry.data_file);
  const data = await readJsonFile<DomainData>(snapshotPath);
  return data ? migrateData(data) : null;
}

/** Returns the current data as a pretty-printed JSON string. */
export async function exportJson(): Promise<string> {
  const data = await loadCurrentData();
  return JSON.stringify(data, null, 2);
}

/** Resets current.json back to the seed template (migrated). */
export async function resetToSeed(): Promise<void> {
  await ensureDataDir();
  const seedRaw = await readFile(SEED_FILE, 'utf-8');
  const seed = JSON.parse(seedRaw) as DomainData;
  delete (seed as Record<string, unknown>)['meta'];
  const migrated = migrateData(seed);
  await writeFile(CURRENT_FILE, JSON.stringify(migrated, null, 2), 'utf-8');
}
