---
Task ID: 1
Agent: main
Task: Implement PostgreSQL 15 + Apache AGE read-only autocomplete in Python Flask app

Work Log:
- Read existing codebase: app.py, schema.py, app.js, style.css, sql-client.ts, store-connections.ts
- Understood original Next.js autocomplete pattern: ILIKE search with is_current_version=true filter
- Created db_connection.py with: config management (file + env vars), connection testing, SQL autocomplete, Apache AGE Cypher autocomplete, unified entry point
- Added 5 API endpoints to app.py: GET/PUT/DELETE /api/db-config, POST /api/db-config/test, POST /api/autocomplete, GET /api/db-status
- Added psycopg2-binary==2.9.9 to requirements.txt
- Updated app.js with: DB state, AUTOCOMPLETE_PATTERNS, isDBSourced/markDBSourced, renderAutocompleteDropdown, triggerAutocomplete with 400ms debounce, applyDBMatch, DB config dialog (render/save/test/delete), DB status indicator in header, "из БД" badge, click-outside dropdown closing
- Updated style.css with: .autocomplete-wrapper, .ac-match-item, .badge-db, .field-input.db-sourced
- Updated docker-compose.yml with PG_* environment variable documentation

Stage Summary:
- New files: python-app/db_connection.py
- Modified files: python-app/app.py, python-app/static/js/app.js, python-app/static/css/style.css, python-app/requirements.txt, python-app/docker-compose.yml
- Backend: PostgreSQL read-only connection with SQL ILIKE + optional Apache AGE Cypher queries
- Frontend: Autocomplete dropdown on eligible fields (INN, OGRN, full_name, short_name, etc.), DB-sourced field highlighting with blue tint + "из БД" badge, DB config dialog accessible from header "БД" button
