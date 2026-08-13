# Task 2-a: Foundation Layer — SQL & Qdrant Knowledge Base Connections
**Agent**: foundation-builder
**Date**: 2026-08-06
**Status**: ✅ Completed

## Summary

Created 5 foundational library files that provide type definitions, persistent storage, and client factories for connecting to PostgreSQL, MySQL, and Qdrant vector databases. These form the base layer for the knowledge-base sync feature (Task 2).

## Files Created

### 1. `src/lib/types/connection.ts`
- TypeScript interfaces for all connection configs (`SQLConnectionConfig`, `QdrantConnectionConfig`, `ConnectionConfigs`)
- Result types: `SQLTableInfo`, `SQLQueryResult`, `QdrantCollectionInfo`, `QdrantSearchResult`, `ConnectionTestResult`

### 2. `src/lib/connection-storage.ts`
- File-based JSON storage at `data/connection-configs.json`
- Follows same `readJsonFile` / `writeFile` patterns as `storage.ts`
- Functions: `readConfigs`, `writeConfigs`, `addSQLConnection`, `addQdrantConnection`, `updateConnection`, `deleteConnection`
- Auto-generates IDs with `sql_`/`qdrant_` prefix and timestamps

### 3. `src/lib/sql-client.ts`
- Factory function `createSQLClient(config)` returns `SQLClient` interface
- PostgreSQL implementation using `pg.Pool` (top-level import)
- MySQL implementation using `mysql2/promise` (dynamic import)
- Methods: `testConnection` (SELECT 1 + timing), `listTables` (information_schema), `describeTable`, `queryTable` (paginated with COUNT), `close`
- 10-second connection timeout; SQL identifier escaping; Russian error messages

### 4. `src/lib/qdrant-client.ts`
- Factory function `createQdrantClient(config)` using `@qdrant/js-client-rest`
- Methods: `testConnection` (getCollections + timing), `listCollections`, `getCollectionInfo`, `search`, `upsert`, `close`
- Handles 404 gracefully in `getCollectionInfo`
- Russian error messages

### 5. `src/lib/qdrant-field-mapper.ts`
- Extracted all 30 unique `qdrant_*` fields from `schema.ts`
- `QDRANT_FIELD_MAP`: maps schema field keys → Qdrant payload keys (strip `qdrant_` prefix and `_tag` suffix)
- `getQdrantFieldKeys()`: returns unique keys array

## Lint

- ESLint passes with zero errors.
- All packages (`pg`, `mysql2`, `@qdrant/js-client-rest`) were already in `package.json`.

## Notes

- All lib files use `@/lib/` import aliases (no `'use server'` needed — consumed from API routes).
- The `qdrant-field-mapper.ts` has intentional duplicate entries in the map object (same key-value across sections); `getQdrantFieldKeys()` deduplicates via `Set`.
