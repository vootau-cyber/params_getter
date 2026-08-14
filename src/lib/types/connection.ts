/** Single PostgreSQL connection config */
export interface PGConnectionConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  /** Optional: Apache AGE graph name for Cypher queries */
  graphName: string;
}

/** Single Qdrant connection config */
export interface QdrantConfig {
  url: string;
  apiKey: string;
  collection: string;
}

export interface ConnectionConfigs {
  postgresql: PGConnectionConfig | null;
  qdrant: QdrantConfig | null;
}

export interface ConnectionTestResult {
  ok: boolean;
  latency?: number;
  error?: string;
}

/** Result from DB autocomplete query */
export interface AutocompleteMatch {
  /** The raw DB row */
  row: Record<string, unknown>;
  /** Human-readable label for the dropdown */
  label: string;
}
