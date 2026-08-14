import { QdrantClient } from '@qdrant/js-client-rest';
import type { QdrantConfig, ConnectionTestResult, AutocompleteMatch } from '@/lib/types/connection';

// ── testQdrantConnection ────────────────────────────────────────────────────

export async function testQdrantConnection(config: QdrantConfig): Promise<ConnectionTestResult> {
  try {
    const client = new QdrantClient({
      url: config.url,
      apiKey: config.apiKey || undefined,
      timeout: 10_000,
    });

    const start = performance.now();
    await client.getCollections();
    const latency = Math.round(performance.now() - start);

    return { ok: true, latency };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Ошибка подключения Qdrant: ${msg}` };
  }
}

// ── semanticSearch ──────────────────────────────────────────────────────────

/**
 * Semantic search via Qdrant vector similarity.
 * Requires an embedding service to convert `query` text into a vector.
 * For now returns an empty array — implement embedding integration when ready.
 */
export async function semanticSearch(
  _config: QdrantConfig,
  _params: {
    query: string;
    limit?: number;
    sectionKey?: string;
  },
): Promise<AutocompleteMatch[]> {
  // TODO: integrate embedding service to convert query text → vector,
  // then call client.search(collection, { vector, limit, filter })
  return [];
}
