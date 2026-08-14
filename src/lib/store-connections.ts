import { create } from 'zustand';
import type {
  PGConnectionConfig,
  QdrantConfig,
  ConnectionTestResult,
  AutocompleteMatch,
} from '@/lib/types/connection';

// =============================================================================
// State interface
// =============================================================================

export interface ConnectionState {
  // Config
  pgConfig: PGConnectionConfig | null;
  qdrantConfig: QdrantConfig | null;
  isLoading: boolean;

  // Test results
  pgTestResult: ConnectionTestResult | null;
  qdrantTestResult: ConnectionTestResult | null;
  isTesting: 'postgresql' | 'qdrant' | null;

  // Autocomplete
  autocompleteResults: AutocompleteMatch[];
  autocompleteLoading: boolean;
  autocompleteSectionKey: string | null;
  autocompleteFieldKey: string | null;
  activeAutocompleteField: { sectionKey: string; fieldKey: string; rowIndex: number } | null;

  // Dialog
  dialogOpen: boolean;

  // Actions
  loadConfigs: () => Promise<void>;
  savePGConfig: (config: PGConnectionConfig) => Promise<void>;
  clearPGConfig: () => Promise<void>;
  saveQdrantConfig: (config: QdrantConfig) => Promise<void>;
  clearQdrantConfig: () => Promise<void>;
  testConnection: (type: 'postgresql' | 'qdrant') => Promise<ConnectionTestResult>;
  openDialog: () => void;
  closeDialog: () => void;
  autocomplete: (sectionKey: string, fieldKey: string, value: string) => Promise<void>;
  clearAutocomplete: () => void;
  setActiveAutocompleteField: (field: { sectionKey: string; fieldKey: string; rowIndex: number } | null) => void;
}

// =============================================================================
// Store
// =============================================================================

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  // ── Initial state ─────────────────────────────────────────────────────────

  pgConfig: null,
  qdrantConfig: null,
  isLoading: false,

  pgTestResult: null,
  qdrantTestResult: null,
  isTesting: null,

  autocompleteResults: [],
  autocompleteLoading: false,
  autocompleteSectionKey: null,
  autocompleteFieldKey: null,
  activeAutocompleteField: null,

  dialogOpen: false,

  // ── Config Actions ─────────────────────────────────────────────────────────

  loadConfigs: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/connections');
      if (!res.ok) throw new Error('Не удалось загрузить подключения');
      const data = await res.json();
      set({
        pgConfig: data.postgresql ?? null,
        qdrantConfig: data.qdrant ?? null,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  savePGConfig: async (config) => {
    const res = await fetch('/api/connections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || 'Ошибка сохранения PostgreSQL');
    }
    set({ pgConfig: config, pgTestResult: null });
  },

  clearPGConfig: async () => {
    await fetch('/api/connections', { method: 'DELETE' });
    set({ pgConfig: null, pgTestResult: null });
  },

  saveQdrantConfig: async (config) => {
    const res = await fetch('/api/connections/qdrant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || 'Ошибка сохранения Qdrant');
    }
    set({ qdrantConfig: config, qdrantTestResult: null });
  },

  clearQdrantConfig: async () => {
    await fetch('/api/connections/qdrant', { method: 'DELETE' });
    set({ qdrantConfig: null, qdrantTestResult: null });
  },

  // ── Test Actions ──────────────────────────────────────────────────────────

  testConnection: async (type) => {
    set({ isTesting: type });
    try {
      const res = await fetch('/api/connections/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const result = await res.json();
      if (!res.ok) {
        const testResult: ConnectionTestResult = { ok: false, error: result.error || 'Ошибка тестирования' };
        if (type === 'postgresql') set({ pgTestResult: testResult });
        else set({ qdrantTestResult: testResult });
        return testResult;
      }
      if (type === 'postgresql') set({ pgTestResult: result });
      else set({ qdrantTestResult: result });
      return result;
    } catch (err) {
      const testResult: ConnectionTestResult = {
        ok: false,
        error: err instanceof Error ? err.message : 'Ошибка сети',
      };
      if (type === 'postgresql') set({ pgTestResult: testResult });
      else set({ qdrantTestResult: testResult });
      return testResult;
    } finally {
      set({ isTesting: null });
    }
  },

  // ── Dialog ─────────────────────────────────────────────────────────────────

  openDialog: () => {
 get().loadConfigs();
    set({ dialogOpen: true });
  },
  closeDialog: () => set({ dialogOpen: false }),

  // ── Autocomplete ──────────────────────────────────────────────────────────

  autocomplete: async (sectionKey, fieldKey, value) => {
    set({ autocompleteLoading: true, autocompleteSectionKey: sectionKey, autocompleteFieldKey: fieldKey });
    try {
      const res = await fetch('/api/connections/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, fieldKey, value }),
      });
      if (!res.ok) {
        const body = await res.json();
        // Silently ignore — no PG config is the common case
        set({ autocompleteResults: [], autocompleteLoading: false });
        return;
      }
      const matches = await res.json();
      set({
        autocompleteResults: Array.isArray(matches) ? matches : [],
        autocompleteLoading: false,
      });
    } catch {
      set({ autocompleteResults: [], autocompleteLoading: false });
    }
  },

  clearAutocomplete: () =>
    set({
      autocompleteResults: [],
      autocompleteSectionKey: null,
      autocompleteFieldKey: null,
      activeAutocompleteField: null,
    }),

  setActiveAutocompleteField: (field) => set({ activeAutocompleteField: field }),
}));
