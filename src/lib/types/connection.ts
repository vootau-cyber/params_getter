// Connection types for SQL and Qdrant knowledge bases

export interface SQLConnectionConfig {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  createdAt: string;
}

export interface QdrantConnectionConfig {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  collection: string;
  createdAt: string;
}

export interface ConnectionConfigs {
  sql_connections: SQLConnectionConfig[];
  qdrant_connections: QdrantConnectionConfig[];
}

export interface SQLTableInfo {
  table_name: string;
  column_count: number;
  row_count: number;
}

export interface SQLQueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  total_count: number;
}

export interface QdrantCollectionInfo {
  name: string;
  points_count: number;
  vectors_count: number;
  status: string;
}

export interface QdrantSearchResult {
  id: string;
  score: number;
  payload: Record<string, unknown>;
}

export interface ConnectionTestResult {
  ok: boolean;
  latency?: number;
  error?: string;
}
