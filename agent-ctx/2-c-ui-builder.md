# Task 2-c: UI Builder — Connection Store & Dialog Component

**Agent:** ui-builder
**Date:** 2026-08-06

## Summary

Created 2 files for the connection management UI:

### 1. `/src/lib/store-connections.ts` — Zustand Store
- **State**: Connection lists (SQL + Qdrant), test results, browser state for both SQL and Qdrant (active connection, tables/collections, search results), dialog open/tab state
- **Actions**: 
  - `loadConnections()` — GET /api/connections
  - `addConnection(type, config)` — POST /api/connections
  - `updateConnection(id, config)` — PUT /api/connections/[id]
  - `deleteConnection(id)` — DELETE /api/connections/[id]
  - `testConnection(id)` — POST /api/connections/[id]/test
  - `openDialog(tab)` / `closeDialog()` — dialog toggle
  - `setActiveSQL(id)` — resets SQL browser, loads tables
  - `loadSQLTables(id)` — GET /api/sql/[id]/tables
  - `setActiveSQLTable(table)` — sets table, loads data
  - `loadSQLTableData(id, table, limit, offset)` — GET /api/sql/[id]/tables/[table]?limit=&offset=
  - `importSQLData(id, table, sectionKey, mapping)` — POST /api/sql/[id]/import
  - `setActiveQdrant(id)` — resets Qdrant browser, loads collections
  - `loadQdrantCollections(id)` — GET /api/qdrant/[id]/collections
  - `searchQdrant(id, opts)` — POST /api/qdrant/[id]/search
  - `syncQdrantTags(id)` — POST /api/qdrant/[id]/sync

### 2. `/src/components/connections-dialog.tsx` — Dialog Component (~1500 lines)
- **Exported component**: `ConnectionsDialog`
- **Layout**: Dialog (max-w-5xl, max-h-[85vh]) with Tabs (SQL | Qdrant)
- **SQL Tab**: Two-column layout (w-80 connection list + flex browser)
  - Connection cards with name, type badge, host:port, test status, action buttons
  - Inline add/edit forms (SQLConnectionForm)
  - Table browser: lists tables with column/row counts, clickable rows
  - Table data grid with scrollable table, pagination, "Импортировать" button
  - Import wizard: target section dropdown, field mapping with auto-fill
- **Qdrant Tab**: Same two-column layout
  - Connection cards with name, URL, collection, test status, action buttons
  - Collection list with points count, status badges, refresh button
  - Search section: vector input (comma-separated) or text query, search button
  - Results list: score badge, payload key-value pairs
  - Sync section: "Синхронизировать теги" button with result message
- **All text in Russian**, desktop-only, blue primary theme
- **Lint**: Passes with zero errors

## Notes
- The `testConnection` action calls POST /api/connections/[id]/test which does not exist yet as an API route. The store handles errors gracefully.
- The dialog is controlled by `useConnectionStore.dialogOpen` / `dialogTab` — can be triggered from anywhere via `useConnectionStore.getState().openDialog('sql')`.
- page.tsx was NOT modified per requirements (will be done separately).
