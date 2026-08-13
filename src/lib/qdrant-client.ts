import { QdrantClient } from '@qdrant/js-client-rest';
import type {
  QdrantConnectionConfig,
  QdrantCollectionInfo,
  QdrantSearchResult,
  ConnectionTestResult,
} from '@/lib/types/connection';

// ── Client interface ─────────────────────────────────────────────────────────

export interface QdrantClientWrapper {
  testConnection(): Promise<ConnectionTestResult>;
  listCollections(): Promise<QdrantCollectionInfo[]>;
  getCollectionInfo(name: string): Promise<QdrantCollectionInfo | null>;
  search(
    collection: string,
    vector: number[],
    opts?: { limit?: number; filter?: Record<string, unknown> },
  ): Promise<QdrantSearchResult[]>;
  upsert(
    collection: string,
    points: Array<{ id: string; vector: number[]; payload: Record<string, unknown> }>,
  ): Promise<number>;
  close(): void;
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function createQdrantClient(config: QdrantConnectionConfig): QdrantClientWrapper {
  const client = new QdrantClient({
    url: config.url,
    apiKey: config.apiKey || undefined,
    timeout: 10_000,
  });

  return {
    async testConnection(): Promise<ConnectionTestResult> {
      try {
        const start = performance.now();
        await client.getCollections();
        const latency = Math.round(performance.now() - start);
        return { ok: true, latency };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { ok: false, error: `Ошибка подключения Qdrant: ${msg}` };
      }
    },

    async listCollections(): Promise<QdrantCollectionInfo[]> {
      try {
        const response = await client.getCollections();
        return (response.collections ?? []).map((c) => ({
          name: c.name,
          points_count: c.points_count ?? 0,
          vectors_count: c.vectors_count ?? 0,
          status: c.status ?? 'unknown',
        }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка получения списка коллекций Qdrant: ${msg}`);
      }
    },

    async getCollectionInfo(name: string): Promise<QdrantCollectionInfo | null> {
      try {
        const collection = await client.getCollection(name);
        return {
          name: collection.name,
          points_count: collection.points_count ?? 0,
          vectors_count: collection.vectors_count ?? 0,
          status: collection.status ?? 'unknown',
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('not found') || msg.includes('404')) {
          return null;
        }
        throw new Error(`Ошибка получения информации о коллекции "${name}": ${msg}`);
      }
    },

    async search(
      collection: string,
      vector: number[],
      opts?: { limit?: number; filter?: Record<string, unknown> },
    ): Promise<QdrantSearchResult[]> {
      try {
        const limit = opts?.limit ?? 10;
        const results = await client.search(collection, {
          vector,
          limit,
          filter: opts?.filter ? { key: '', match: opts.filter } : undefined,
        });

        return results.map((r) => ({
          id: String(r.id),
          score: r.score ?? 0,
          payload: (r.payload ?? {}) as Record<string, unknown>,
        }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка поиска в коллекции "${collection}": ${msg}`);
      }
    },

    async upsert(
      collection: string,
      points: Array<{ id: string; vector: number[]; payload: Record<string, unknown> }>,
    ): Promise<number> {
      try {
        await client.upsert(collection, {
          points: points.map((p) => ({
            id: p.id,
            vector: p.vector,
            payload: p.payload,
          })),
        });
        return points.length;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Ошибка обновления коллекции "${collection}": ${msg}`);
      }
    },

    close(): void {
      // QdrantClient (REST) does not maintain persistent connections;
      // this is a no-op cleanup hook for consistency.
    },
  };
}
