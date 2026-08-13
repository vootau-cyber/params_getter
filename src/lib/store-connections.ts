import { create } from 'zustand';
import type {
  SQLConnectionConfig,
  QdrantConnectionConfig,
  ConnectionTestResult,
  SQLTableInfo,
  SQLQueryResult,
  QdrantCollectionInfo,
  QdrantSearchResult,
} from '@/lib/types/connection';

// =============================================================================
// State interface
// =============================================================================

export interface ConnectionState {
  // Connection lists
  sqlConnections: SQLConnectionConfig[];
  qdrantConnections: QdrantConnectionConfig[];
  isLoading: boolean;
  testResults: Record<string, ConnectionTestResult>;

  // SQL browser state
  activeSQLId: string | null;
  sqlTables: SQLTableInfo[];
  sqlTablesLoading: boolean;
  activeSQLTable: string | null;
  sqlTableData: SQLQueryResult | null;
  sqlTableLoading: boolean;

  // Qdrant browser state
  activeQdrantId: string | null;
  qdrantCollections: QdrantCollectionInfo[];
  qdrantCollectionsLoading: boolean;
  qdrantSearchResults: QdrantSearchResult[];
  qdrantSearchLoading: boolean;

  // Dialog
  dialogOpen: boolean;
  dialogTab: 'sql' | 'qdrant';

  // Actions
  loadConnections: () => Promise<void>;
  addConnection: (type: 'sql' | 'qdrant', config: Record<string, unknown>) => Promise<void>;
  updateConnection: (id: string, config: Record<string, unknown>) => Promise<void>;
  deleteConnection: (id: string) => Promise<void>;
  testConnection: (id: string) => Promise<void>;
  openDialog: (tab: 'sql' | 'qdrant') => void;
  closeDialog: () => void;

  // SQL browser actions
  setActiveSQL: (id: string | null) => void;
  loadSQLTables: (id: string) => Promise<void>;
  setActiveSQLTable: (table: string | null) => void;
  loadSQLTableData: (id: string, table: string, limit?: number, offset?: number) => Promise<void>;
  importSQLData: (
    id: string,
    table: string,
    sectionKey: string,
    mapping: Record<string, string>,
  ) => Promise<{ success: boolean; imported?: number; error?: string }>;

  // Qdrant browser actions
  setActiveQdrant: (id: string | null) => void;
  loadQdrantCollections: (id: string) => Promise<void>;
  searchQdrant: (
    id: string,
    opts: { collection?: string; vector?: number[]; query?: string; limit?: number },
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  syncQdrantTags: (
    id: string,
  ) => Promise<{ success: boolean; message?: string; error?: string; affectedSections?: string[] | string }>;
}

// =============================================================================
// Store
// =============================================================================

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  // ── Initial state ─────────────────────────────────────────────────────────

  sqlConnections: [],
  qdrantConnections: [],
  isLoading: false,
  testResults: {},

  activeSQLId: null,
  sqlTables: [],
  sqlTablesLoading: false,
  activeSQLTable: null,
  sqlTableData: null,
  sqlTableLoading: false,

  activeQdrantId: null,
  qdrantCollections: [],
  qdrantCollectionsLoading: false,
  qdrantSearchResults: [],
  qdrantSearchLoading: false,

  dialogOpen: false,
  dialogTab: 'sql',

  // ── Connection CRUD ──────────────────────────────────────────────────────

  loadConnections: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/connections');
      if (!res.ok) throw new Error('Не удалось загрузить подключения');
      const data = await res.json();
      set({
        sqlConnections: Array.isArray(data.sql_connections) ? data.sql_connections : [],
        qdrantConnections: Array.isArray(data.qdrant_connections) ? data.qdrant_connections : [],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addConnection: async (type, config) => {
    const res = await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...config }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || 'Ошибка создания подключения');
    }
    await get().loadConnections();
  },

  updateConnection: async (id, config) => {
    const res = await fetch(`/api/connections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || 'Ошибка обновления подключения');
    }
    await get().loadConnections();
  },

  deleteConnection: async (id) => {
    const res = await fetch(`/api/connections/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || 'Ошибка удаления подключения');
    }
    await get().loadConnections();
    // Reset active state if the deleted connection was active
    const state = get();
    if (state.activeSQLId === id) {
      set({ activeSQLId: null, sqlTables: [], activeSQLTable: null, sqlTableData: null });
    }
    if (state.activeQdrantId === id) {
      set({ activeQdrantId: null, qdrantCollections: [], qdrantSearchResults: [] });
    }
  },

  testConnection: async (id) => {
    set((s) => ({
      testResults: { ...s.testResults, [id]: { ok: false, error: 'Тестирование…' } },
    }));
    try {
      const res = await fetch(`/api/connections/${id}/test`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json();
        set((s) => ({
          testResults: {
            ...s.testResults,
            [id]: { ok: false, error: body.error || 'Ошибка тестирования' },
          },
        }));
        return;
      }
      const result = await res.json();
      set((s) => ({
        testResults: { ...s.testResults, [id]: result },
      }));
    } catch (err) {
      set((s) => ({
        testResults: {
          ...s.testResults,
          [id]: {
            ok: false,
            error: err instanceof Error ? err.message : 'Ошибка сети',
          },
        },
      }));
    }
  },

  // ── Dialog ───────────────────────────────────────────────────────────────

  openDialog: (tab) => set({ dialogOpen: true, dialogTab: tab }),
  closeDialog: () => set({ dialogOpen: false }),

  // ── SQL Browser ─────────────────────────────────────────────────────────

  setActiveSQL: (id) => {
    set({
      activeSQLId: id,
      sqlTables: [],
      sqlTablesLoading: false,
      activeSQLTable: null,
      sqlTableData: null,
      sqlTableLoading: false,
    });
    if (id) {
      get().loadSQLTables(id);
    }
  },

  loadSQLTables: async (id) => {
    set({ sqlTablesLoading: true });
    try {
      const res = await fetch(`/api/sql/${id}/tables`);
      if (!res.ok) {
        throw new Error('Не удалось загрузить список таблиц');
      }
      const data = await res.json();
      set({
        sqlTables: Array.isArray(data) ? data : [],
        sqlTablesLoading: false,
      });
    } catch (err) {
      set({ sqlTablesLoading: false });
      console.error('Error loading SQL tables:', err);
    }
  },

  setActiveSQLTable: (table) => {
    set({ activeSQLTable: table, sqlTableData: null });
    const { activeSQLId } = get();
    if (table && activeSQLId) {
      get().loadSQLTableData(activeSQLId, table, 50, 0);
    }
  },

  loadSQLTableData: async (id, table, limit = 50, offset = 0) => {
    set({ sqlTableLoading: true });
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const res = await fetch(`/api/sql/${id}/tables/${table}?${params}`);
      if (!res.ok) {
        throw new Error('Не удалось загрузить данные таблицы');
      }
      const data = await res.json();
      set({ sqlTableData: data, sqlTableLoading: false });
    } catch (err) {
      set({ sqlTableLoading: false });
      console.error('Error loading SQL table data:', err);
    }
  },

  importSQLData: async (id, table, sectionKey, mapping) => {
    const res = await fetch(`/api/sql/${id}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, sectionKey, mapping }),
    });
    if (!res.ok) {
      const body = await res.json();
      return { success: false, error: body.error || 'Ошибка импорта' };
    }
    const body = await res.json();
    return { success: true, imported: body.imported };
  },

  // ── Qdrant Browser ────────────────────────────────────────────────────

  setActiveQdrant: (id) => {
    set({
      activeQdrantId: id,
      qdrantCollections: [],
      qdrantCollectionsLoading: false,
      qdrantSearchResults: [],
      qdrantSearchLoading: false,
    });
    if (id) {
      get().loadQdrantCollections(id);
    }
  },

  loadQdrantCollections: async (id) => {
    set({ qdrantCollectionsLoading: true });
    try {
      const res = await fetch(`/api/qdrant/${id}/collections`);
      if (!res.ok) {
        throw new Error('Не удалось загрузить список коллекций');
      }
      const data = await res.json();
      set({
        qdrantCollections: Array.isArray(data) ? data : [],
        qdrantCollectionsLoading: false,
      });
    } catch (err) {
      set({ qdrantCollectionsLoading: false });
      console.error('Error loading Qdrant collections:', err);
    }
  },

  searchQdrant: async (id, opts) => {
    set({ qdrantSearchLoading: true });
    try {
      const res = await fetch(`/api/qdrant/${id}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      });
      if (!res.ok) {
        const body = await res.json();
        return { success: false, error: body.error || 'Ошибка поиска' };
      }
      const data = await res.json();
      set({
        qdrantSearchResults: Array.isArray(data.results) ? data.results : [],
        qdrantSearchLoading: false,
      });
      if (data.message) {
        return { success: true, message: data.message };
      }
      return { success: true };
    } catch (err) {
      set({ qdrantSearchLoading: false });
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Ошибка сети',
      };
    }
  },

  syncQdrantTags: async (id) => {
    try {
      const res = await fetch(`/api/qdrant/${id}/sync`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json();
        return { success: false, error: body.error || 'Ошибка синхронизации' };
      }
      const data = await res.json();
      return {
        success: true,
        message: data.message,
        affectedSections: data.affectedSections,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Ошибка сети',
      };
    }
  },
}));
