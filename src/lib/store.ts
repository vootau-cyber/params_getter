import { create } from 'zustand';
import type { FieldDef } from './schema';
import { getEmptyRow, SCHEMA_SECTIONS, getVirtualFieldKeys, getRefAutoFillMappings } from './schema';

// =============================================================================
// Types
// =============================================================================

export interface AuthorInfo {
  name: string;
  role: string;
}

export interface VersionMeta {
  id: number;
  timestamp: string;
  author_name: string;
  author_role: string;
  changed_sections: string[];
  version_label: string;
}

export interface AppState {
  // Data
  data: Record<string, unknown[]>;
  initialData: Record<string, unknown[]>;
  isLoading: boolean;
  isSaving: boolean;

  // UI state
  activeSection: string;
  sidebarOpen: boolean;

  // Version state
  versions: VersionMeta[];
  versionsOpen: boolean;
  importDialogOpen: boolean;

  // Author
  author: AuthorInfo;

  // DB-sourced autocomplete fields
  dbSourcedFields: Record<string, Set<string>>; // sectionKey -> Set of "rowIndex:fieldKey"

  // Actions
  setActiveSection: (key: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setAuthor: (author: AuthorInfo) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<{ success: boolean; version?: number; changed_sections?: string[]; error?: string }>;
  updateCell: (sectionKey: string, rowIndex: number, fieldKey: string, value: unknown) => void;
  addRow: (sectionKey: string) => void;
  removeRow: (sectionKey: string, rowIndex: number) => void;
  updateNestedCell: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number, nestedFieldKey: string, value: unknown) => void;
  addNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string) => void;
  removeNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number) => void;
  loadVersions: () => Promise<void>;
  setVersionsOpen: (open: boolean) => void;
  loadVersionData: (versionId: number) => Promise<void>;
  setImportDialogOpen: (open: boolean) => void;
  importData: (file: File) => Promise<{ success: boolean; error?: string }>;
  resetData: () => Promise<void>;
  isDirty: () => boolean;
  getJson: () => string;
  /** Returns data with virtual fields stripped for saving/exporting */
  getCleanData: () => Record<string, unknown[]>;
  markDBSourced: (sectionKey: string, rowIndex: number, fieldKey: string) => void;
  clearDBSourced: () => void;
  isDBSourced: (sectionKey: string, rowIndex: number, fieldKey: string) => boolean;
}

// =============================================================================
// Deep clone helper
// =============================================================================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// =============================================================================
// Nested fields helpers
// =============================================================================

function getNestedFieldsDef(sectionKey: string, fieldKey: string): FieldDef[] {
  const section = SCHEMA_SECTIONS.find((s) => s.key === sectionKey);
  const field = section?.fields.find((f) => f.key === fieldKey);
  return field?.nestedFields || [];
}

function getEmptyNestedRow(nestedFields: FieldDef[]): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of nestedFields) {
    if (field.type === 'boolean') {
      row[field.key] = field.defaultValue ?? false;
    } else if (field.type === 'number') {
      row[field.key] = field.defaultValue ?? null;
    } else if (field.type === 'array') {
      row[field.key] = [];
    } else {
      row[field.key] = field.defaultValue ?? '';
    }
  }
  return row;
}

// =============================================================================
// Auto-fill companion name fields from infrastructure refs
// =============================================================================

const INFRA_REF_TO_NAME: Record<string, string> = {
  located_on_infra_ref: 'located_on_name',
  connected_to_infra_ref: 'connected_to_name',
  berth_infra_ref: 'berth_name',
  tsotb_location_infra_ref: 'tsotb_location_name',
  tsotb_monitors_infra_ref: 'tsotb_monitors_object_name',
  tsotb_powered_from_infra_ref: 'tsotb_powered_from_name',
  eng_instance_location_infra_ref: 'eng_instance_location_name',
};

function autoFillNameFromRef(
  sectionKey: string,
  rowIndex: number,
  refFieldKey: string,
  refValue: unknown
) {
  const nameFieldKey = INFRA_REF_TO_NAME[refFieldKey];
  if (!nameFieldKey) return;

  const state = useStore.getState();
  const infraRows = (state.data['infrastructure'] || []) as Record<string, unknown>[];
  const idx = refValue as number | null;
  const name = idx !== null && idx !== undefined && infraRows[idx]
    ? String(infraRows[idx]['obj_name'] || '')
    : '';

  // Set the name field
  set((s) => {
    const sectionRows = (s.data[sectionKey] || []) as Record<string, unknown>[];
    const rows = sectionRows.map((r, i) =>
      i === rowIndex ? { ...r, [nameFieldKey]: name } : r
    );
    return { data: { ...s.data, [sectionKey]: rows } };
  });
}

// =============================================================================
// Auto-fill from virtual ref fields
// =============================================================================

/** Cached at module level, rebuilt on first use */
let _refAutoFillCache: ReturnType<typeof getRefAutoFillMappings> | null = null;

function getAutoFillMappings() {
  if (!_refAutoFillCache) {
    _refAutoFillCache = getRefAutoFillMappings();
  }
  return _refAutoFillCache;
}

function autoFillFromVirtualRef(
  sectionKey: string,
  rowIndex: number,
  virtualFieldKey: string,
  refValue: unknown
) {
  const mappings = getAutoFillMappings();
  const sectionMappings = mappings[sectionKey];
  if (!sectionMappings) return;

  const fillMap = sectionMappings[virtualFieldKey];
  if (!fillMap) return;

  // Find the ref field def to get the refSection
  const section = SCHEMA_SECTIONS.find((s) => s.key === sectionKey);
  const fieldDef = section?.fields.find((f) => f.key === virtualFieldKey);
  if (!fieldDef?.refSection) return;

  const state = useStore.getState();
  const refRows = (state.data[fieldDef.refSection] || []) as Record<string, unknown>[];
  const idx = refValue as number | null;

  console.log('[DEBUG autoFill]', { sectionKey, virtualFieldKey, refValue: idx, refSection: fieldDef.refSection, refRowsCount: refRows.length, sourceRow: idx !== null && refRows[idx] ? refRows[idx] : 'N/A' });

  if (idx === null || idx === undefined || !refRows[idx]) {
    // Clear auto-filled fields when ref is cleared
    set((s) => {
      const sectionRows = (s.data[sectionKey] || []) as Record<string, unknown>[];
      const updates: Record<string, unknown> = {};
      for (const targetKey of Object.keys(fillMap)) {
        // Determine default based on target field type
        const targetField = section?.fields.find((f) => f.key === targetKey);
        if (targetField?.type === 'boolean') {
          updates[targetKey] = targetField.defaultValue ?? false;
        } else if (targetField?.type === 'number' || targetField?.type === 'date') {
          updates[targetKey] = targetField.defaultValue ?? null;
        } else {
          updates[targetKey] = targetField?.defaultValue ?? '';
        }
      }
      const rows = sectionRows.map((r, i) =>
        i === rowIndex ? { ...r, ...updates } : r
      );
      return { data: { ...s.data, [sectionKey]: rows } };
    });
    return;
  }

  const sourceRow = refRows[idx];

  // Build the updates
  const updates: Record<string, unknown> = {};
  for (const [targetKey, sourceKey] of Object.entries(fillMap)) {
    updates[targetKey] = sourceRow[sourceKey] ?? '';
  }
  console.log('[DEBUG autoFill] applying updates:', JSON.stringify(updates));

  // Apply updates
  set((s) => {
    const sectionRows = (s.data[sectionKey] || []) as Record<string, unknown>[];
    const rows = sectionRows.map((r, i) =>
      i === rowIndex ? { ...r, ...updates } : r
    );
    return { data: { ...s.data, [sectionKey]: rows } };
  });
}

// =============================================================================
// Virtual field stripping
// =============================================================================

let _virtualKeysCache: ReturnType<typeof getVirtualFieldKeys> | null = null;

function getVirtualKeys() {
  if (!_virtualKeysCache) {
    _virtualKeysCache = getVirtualFieldKeys();
  }
  return _virtualKeysCache;
}

/** Strips all virtual fields from data, returning a clean copy for saving/exporting. */
function stripVirtualFields(data: Record<string, unknown[]>): Record<string, unknown[]> {
  const virtualKeys = getVirtualKeys();
  const clean: Record<string, unknown[]> = {};

  for (const [sectionKey, rows] of Object.entries(data)) {
 const sectionVirtualKeys = virtualKeys[sectionKey];
    if (!sectionVirtualKeys || sectionVirtualKeys.size === 0) {
      clean[sectionKey] = rows;
      continue;
    }

    clean[sectionKey] = rows.map((row) => {
      const r = row as Record<string, unknown>;
      const stripped: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) {
        if (!sectionVirtualKeys.has(k)) {
          stripped[k] = v;
        }
      }
      return stripped;
    });
  }

  return clean;
}

// =============================================================================
// Store
// =============================================================================

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  data: {},
  initialData: {},
  isLoading: true,
  isSaving: false,
  activeSection: 'sti',
  sidebarOpen: false,
  versions: [],
  versionsOpen: false,
  importDialogOpen: false,
  author: { name: '', role: '' },
  dbSourcedFields: {},

  // ── UI Actions ─────────────────────────────────────────────────────────────

  setActiveSection: (key: string) => set({ activeSection: key }),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  setAuthor: (author: AuthorInfo) => set({ author }),

  // ── Data Actions ─────────────────────────────────────────────────────────

  loadData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Не удалось загрузить данные');
      const data = await res.json();
      // Ensure every section key has an array
      const normalized: Record<string, unknown[]> = {};
      for (const key of Object.keys(data)) {
        normalized[key] = Array.isArray(data[key]) ? data[key] : [];
      }
      set({
        data: normalized,
        initialData: deepClone(normalized),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  saveData: async () => {
    const { author } = get();
    const cleanData = get().getCleanData();
    set({ isSaving: true });
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: cleanData, author }),
      });
      if (!res.ok) {
        const body = await res.json();
        return { success: false, error: body.error || 'Ошибка сохранения' };
      }
      const body = await res.json();
      await get().loadData();
      await get().loadVersions();
      set({ isSaving: false });
      return {
        success: true,
        version: body.version,
        changed_sections: body.changed_sections,
      };
    } catch (err) {
      set({ isSaving: false });
      return { success: false, error: err instanceof Error ? err.message : 'Ошибка сети' };
    }
  },

  updateCell: (sectionKey, rowIndex, fieldKey, value) => {
 set((state) => {
      const sectionRows = (state.data[sectionKey] || []) as Record<string, unknown>[];
      const rows = sectionRows.map((r, i) =>
        i === rowIndex ? { ...r, [fieldKey]: value } : r
      );
      return { data: { ...state.data, [sectionKey]: rows } };
    });

    // Auto-fill companion *_name fields when an infra ref changes
    if (fieldKey.endsWith('_infra_ref')) {
      autoFillNameFromRef(sectionKey, rowIndex, fieldKey, value);
    }

    // Auto-fill from virtual ref fields
    const mappings = getAutoFillMappings();
    if (mappings[sectionKey]?.[fieldKey]) {
      autoFillFromVirtualRef(sectionKey, rowIndex, fieldKey, value);
    }
  },

  addRow: (sectionKey) => {
    set((state) => {
      const newRow = getEmptyRow(sectionKey);
      const rows = [...state.data[sectionKey], newRow];
      return { data: { ...state.data, [sectionKey]: rows } };
    });
  },

  removeRow: (sectionKey, rowIndex) => {
    set((state) => {
      const rows = state.data[sectionKey].filter((_, i) => i !== rowIndex);
      return { data: { ...state.data, [sectionKey]: rows } };
    });
  },

  updateNestedCell: (sectionKey, rowIndex, fieldKey, nestedIndex, nestedFieldKey, value) => {
    set((state) => {
      const sectionRows = (state.data[sectionKey] || []) as Record<string, unknown>[];
      const rows = sectionRows.map((r, i) => {
        if (i !== rowIndex) return r;
        const row = { ...r };
        const nestedArr = (row[fieldKey] || []) as Record<string, unknown>[];
        const updatedNested = nestedArr.map((n, ni) =>
          ni === nestedIndex ? { ...n, [nestedFieldKey]: value } : n
        );
        row[fieldKey] = updatedNested;
        return row;
      });
      return { data: { ...state.data, [sectionKey]: rows } };
    });
  },

  addNestedRow: (sectionKey, rowIndex, fieldKey) => {
    set((state) => {
      const sectionRows = (state.data[sectionKey] || []) as Record<string, unknown>[];
      const rows = sectionRows.map((r, i) => {
        if (i !== rowIndex) return r;
        const row = { ...r };
        const nestedFields = getNestedFieldsDef(sectionKey, fieldKey);
        const emptyNested = getEmptyNestedRow(nestedFields);
        const nestedArr = [...((row[fieldKey] || []) as Record<string, unknown>[]), emptyNested];
        row[fieldKey] = nestedArr;
        return row;
      });
      return { data: { ...state.data, [sectionKey]: rows } };
    });
  },

  removeNestedRow: (sectionKey, rowIndex, fieldKey, nestedIndex) => {
    set((state) => {
      const sectionRows = (state.data[sectionKey] || []) as Record<string, unknown>[];
      const rows = sectionRows.map((r, i) => {
        if (i !== rowIndex) return r;
        const row = { ...r };
        const nestedArr = ((row[fieldKey] || []) as Record<string, unknown>[]).filter(
          (_, ni) => ni !== nestedIndex
        );
        row[fieldKey] = nestedArr;
        return row;
      });
      return { data: { ...state.data, [sectionKey]: rows } };
    });
  },

  // ── Version Actions ────────────────────────────────────────────────────────

  loadVersions: async () => {
    try {
      const res = await fetch('/api/versions');
      if (res.ok) {
        const versions = await res.json();
        set({ versions: Array.isArray(versions) ? versions : [] });
      }
    } catch {
      // Silently fail
    }
  },

  setVersionsOpen: (open: boolean) => set({ versionsOpen: open }),

  loadVersionData: async (versionId: number) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/versions/${versionId}`);
      if (!res.ok) throw new Error('Версия не найдена');
      const data = await res.json();
      const normalized: Record<string, unknown[]> = {};
      for (const key of Object.keys(data)) {
        normalized[key] = Array.isArray(data[key]) ? data[key] : [];
      }
      set({
        data: normalized,
        initialData: deepClone(normalized),
        isLoading: false,
      });
      await get().loadVersions();
    } catch {
      set({ isLoading: false });
    }
  },

  // ── Import Actions ────────────────────────────────────────────────────────

  setImportDialogOpen: (open: boolean) => set({ importDialogOpen: open }),

  importData: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json();
        return { success: false, error: body.error || 'Ошибка импорта' };
      }
      await get().loadData();
      await get().loadVersions();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Ошибка сети' };
    }
  },

  // ── Reset Action ────────────────────────────────────────────────────────────

  resetData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Не удалось сбросить данные');
      await get().loadData();
      await get().loadVersions();
    } catch {
      set({ isLoading: false });
    }
  },

  // ── Dirty Detection ────────────────────────────────────────────────────────

  isDirty: () => {
    const { data, initialData } = get();
    // Compare only non-virtual fields
    const cleanData = stripVirtualFields(data);
    return JSON.stringify(cleanData) !== JSON.stringify(initialData);
  },

  // ── JSON Export (with virtual fields stripped) ──────────────────────────

  getCleanData: () => {
    return stripVirtualFields(get().data);
  },

  getJson: () => {
    return JSON.stringify(get().getCleanData(), null, 2);
  },

  // ── DB-Sourced Fields ─────────────────────────────────────────────────────

  markDBSourced: (sectionKey, rowIndex, fieldKey) => {
    const key = `${rowIndex}:${fieldKey}`;
    set((s) => {
      const sectionSet = s.dbSourcedFields[sectionKey]
        ? new Set(s.dbSourcedFields[sectionKey])
        : new Set<string>();
      sectionSet.add(key);
      return {
        dbSourcedFields: { ...s.dbSourcedFields, [sectionKey]: sectionSet },
      };
    });
  },

  clearDBSourced: () => set({ dbSourcedFields: {} }),

  isDBSourced: (sectionKey, rowIndex, fieldKey) => {
    const key = `${rowIndex}:${fieldKey}`;
    return get().dbSourcedFields[sectionKey]?.has(key) ?? false;
  },
}));
