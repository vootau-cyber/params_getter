# Task 2-b: API Routes Builder — Work Record

## Agent: api-routes-builder
## Task ID: 2-b

## Summary
Created all 10 API routes for SQL and Qdrant connection management, data import, and Qdrant operations. All routes follow the project's existing API style (NextRequest/NextResponse, try/catch, Russian error messages).

## Files Created

### 1. `/src/app/api/connections/route.ts`
- **GET**: Returns all connection configs from `readConfigs()`
- **POST**: Validates body type (`sql` or `qdrant`), calls `addSQLConnection` or `addQdrantConnection`, returns 201

### 2. `/src/app/api/connections/[id]/route.ts`
- **GET**: Finds connection by id across both SQL and Qdrant arrays
- **PUT**: Updates connection fields in-place, writes back configs
- **DELETE**: Finds and removes connection using `deleteConnection(id)`

### 3. `/src/app/api/connections/[id]/test/route.ts`
- **POST**: Finds connection config, dynamically imports appropriate client (`createSQLClient` or `createQdrantClient`), calls `testConnection()`, returns result
- Uses dynamic import for SQL client to avoid bundling pg/mysql2 in cold path
- Properly closes client in `finally` block

### 4. `/src/app/api/sql/[id]/tables/route.ts`
- **GET**: Lists all tables for a given SQL connection using `listTables()`

### 5. `/src/app/api/sql/[id]/tables/[table]/route.ts`
- **GET**: Describes table schema (`describeTable`) and queries data (`queryTable`) in parallel
- Supports `?limit=N&offset=N` query params (default limit: 50, max: 1000)

### 6. `/src/app/api/sql/[id]/import/route.ts`
- **POST**: Body: `{ table, sectionKey, mapping }`
- Loads ALL rows from SQL table (limit: 100,000)
- For each row, creates a new empty row via `getEmptyRow(sectionKey)` and applies field mapping
- Appends to existing section data
- Saves via `saveData()` with system author
- Returns `{ imported: number }`

### 7. `/src/app/api/qdrant/[id]/collections/route.ts`
- **GET**: Lists all collections using `listCollections()`

### 8. `/src/app/api/qdrant/[id]/search/route.ts`
- **POST**: Body: `{ collection?, vector?, query?, limit?, filter? }`
- Falls back to config.collection if collection not in body
- If text query without vector: returns placeholder message about embedding service
- Validates vector is present and non-empty before searching

### 9. `/src/app/api/qdrant/[id]/upsert/route.ts`
- **POST**: Body: `{ collection?, points: Array<{id, vector, payload}> }`
- Validates each point has required fields
- Returns `{ upserted: count }`

### 10. `/src/app/api/qdrant/[id]/sync/route.ts`
- **POST**: Scans all data sections for qdrant_* field presence using `getQdrantFieldKeys()`
- Returns affected sections list and a message that auto-sync requires embedding service
- Placeholder for future embedding integration

## Key Design Decisions
- **Dynamic imports** for sql-client and qdrant-client to avoid bundling heavy dependencies (pg, mysql2, @qdrant/js-client-rest) in the cold path
- **Russian error messages** throughout all routes for consistency
- **`RouteContext` type alias** using `params: Promise<{ id: string }>` for Next.js 16 async params
- **SQL import limit** set to 100,000 rows to prevent memory issues
- **Query limit** capped at 1,000 for table browsing
- **Client cleanup** in `finally` blocks ensures no connection leaks

## Lint Status
✅ All files pass `bun run lint` with zero errors
