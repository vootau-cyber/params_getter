# =============================================================================
# PostgreSQL 15 + Apache AGE read-only connection module
# Python 3.8 compatible
# =============================================================================
#
# This module provides:
#   1. Standard SQL queries via psycopg2 (ILIKE search with is_current_version)
#   2. Optional Cypher queries via Apache AGE extension (graph traversal)
#   3. Connection testing with latency measurement
#   4. Configuration management (load/save from JSON file)
#
# Usage:
#   from db_connection import get_pg_config, test_pg_connection, autocomplete_from_pg
#

from __future__ import annotations

import json
import os
import re
import time
from typing import Any, Dict, List, Optional, Tuple


# =============================================================================
# Configuration
# =============================================================================

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'data', 'db_config.json')


DEFAULT_PG_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'maritime_db',
    'username': 'postgres',
    'password': '',
    'ssl': False,
    'graph_name': '',  # Apache AGE graph name (empty = use SQL only)
}


def load_pg_config() -> Optional[Dict[str, Any]]:
    """Load PostgreSQL connection config from JSON file.

    Returns None if no config file exists.
    """
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            config = json.load(f)
        # Validate required fields
        required = ['host', 'port', 'database', 'username', 'password']
        for key in required:
            if key not in config:
                return None
        return config
    except (IOError, ValueError, TypeError):
        return None


def save_pg_config(config: Dict[str, Any]) -> None:
    """Save PostgreSQL connection config to JSON file."""
    data_dir = os.path.dirname(CONFIG_PATH)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)


def delete_pg_config() -> None:
    """Delete PostgreSQL connection config file."""
    if os.path.exists(CONFIG_PATH):
        os.remove(CONFIG_PATH)


def get_pg_config_from_env() -> Optional[Dict[str, Any]]:
    """Build PG config from environment variables (Docker-friendly).

    Env vars:
      PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD, PG_SSL, PG_GRAPH_NAME
    """
    host = os.environ.get('PG_HOST')
    if not host:
        return None
    return {
        'host': host,
        'port': int(os.environ.get('PG_PORT', '5432')),
        'database': os.environ.get('PG_DATABASE', 'maritime_db'),
        'username': os.environ.get('PG_USERNAME', 'postgres'),
        'password': os.environ.get('PG_PASSWORD', ''),
        'ssl': os.environ.get('PG_SSL', 'false').lower() == 'true',
        'graph_name': os.environ.get('PG_GRAPH_NAME', ''),
    }


def get_effective_pg_config() -> Optional[Dict[str, Any]]:
    """Get the effective PG config: env vars override file config."""
    env_config = get_pg_config_from_env()
    if env_config:
        return env_config
    return load_pg_config()


# =============================================================================
# Connection helpers
# =============================================================================

def _get_connection(config: Dict[str, Any]):
    """Create a psycopg2 connection (lazy import)."""
    import psycopg2
    import psycopg2.extras

    ssl_mode = config.get('ssl', False)
    conn_params = {
        'host': config['host'],
        'port': int(config['port']),
        'dbname': config['database'],
        'user': config['username'],
        'password': config['password'],
        'connect_timeout': 10,
    }
    if ssl_mode:
        conn_params['sslmode'] = 'require'
    return psycopg2.connect(**conn_params)


def _sanitize_identifier(name: str) -> str:
    """Sanitize a table/column identifier to prevent SQL injection.

    Only allows alphanumeric and underscore characters.
    """
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', name):
        raise ValueError('Недопустимый идентификатор: {}'.format(name))
    return '"{}"'.format(name)


def _generate_label(row: Dict[str, Any]) -> str:
    """Generate a human-readable label from the first 2-3 text fields."""
    skip_lower = ('id', 'uuid', 'created', 'updated', 'version', 'is_current_version')
    parts = []
    for k, v in row.items():
        kl = k.lower()
        if any(s in kl for s in skip_lower):
            continue
        if v is None:
            continue
        s = str(v).strip()
        if s:
            parts.append(s)
        if len(parts) >= 3:
            break
    return ' — '.join(parts) if parts else '—'


# =============================================================================
# Test connection
# =============================================================================

def test_pg_connection(config: Dict[str, Any]) -> Dict[str, Any]:
    """Test PostgreSQL connection. Returns {'ok': bool, 'latency_ms': int, 'error': str?}."""
    import psycopg2

    conn = None
    try:
        start = time.time()
        conn = _get_connection(config)
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.close()
        latency = int((time.time() - start) * 1000)

        # Check if Apache AGE extension is available
        graph_name = config.get('graph_name', '')
        age_available = False
        if graph_name:
            try:
                cur = conn.cursor()
                cur.execute('SELECT extname FROM pg_extension WHERE extname = %s', ('age',))
                age_available = cur.fetchone() is not None
                cur.close()
            except Exception:
                pass

        return {
            'ok': True,
            'latency_ms': latency,
            'age_available': age_available,
            'graph_name': graph_name if age_available else '',
        }
    except Exception as e:
        return {
            'ok': False,
            'error': 'Ошибка подключения PostgreSQL: {}'.format(str(e)),
        }
    finally:
        if conn:
            try:
                conn.close()
            except Exception:
                pass


# =============================================================================
# Autocomplete (standard SQL)
# =============================================================================

def autocomplete_from_pg(
    config: Dict[str, Any],
    section_key: str,
    field_key: str,
    value: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Query PostgreSQL for autocomplete matches.

    Uses standard SQL with ILIKE. The table name is the section_key,
    the column name is the field_key. Only rows with is_current_version = true
    are returned.

    Returns a list of {'row': {...}, 'label': '...'} dicts.
    """
    import psycopg2.extras

    table = _sanitize_identifier(section_key)
    column = _sanitize_identifier(field_key)

    conn = None
    try:
        conn = _get_connection(config)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = (
            'SELECT * FROM {table} '
            'WHERE {column} ILIKE %s AND is_current_version = true '
            'LIMIT %s'
        ).format(table=table, column=column)

        cur.execute(query, ['%{}%'.format(value), limit])
        rows = cur.fetchall()
        cur.close()

        result = []
        for r in rows:
            row_dict = dict(r)
            result.append({
                'row': row_dict,
                'label': _generate_label(row_dict),
            })
        return result
    finally:
        if conn:
            try:
                conn.close()
            except Exception:
                pass


# =============================================================================
# Autocomplete (Apache AGE Cypher)
# =============================================================================

def autocomplete_from_age(
    config: Dict[str, Any],
    section_key: str,
    field_key: str,
    value: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Query PostgreSQL via Apache AGE Cypher for autocomplete matches.

    Uses the graph name from config. The node label is derived from section_key
    (capitalized). The property name is the field_key.
    Only nodes with is_current_version = true are returned.

    Returns a list of {'row': {...}, 'label': '...'} dicts.
    """
    import psycopg2.extras

    graph_name = config.get('graph_name', '')
    if not graph_name:
        raise ValueError('Имя графа Apache AGE не указано в настройках подключения')

    # Sanitize graph name and field key
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', graph_name):
        raise ValueError('Недопустимое имя графа: {}'.format(graph_name))
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', field_key):
        raise ValueError('Недопустимый ключ поля: {}'.format(field_key))

    # Derive node label from section_key (e.g., 'sti' -> 'Sti', 'post_staff' -> 'PostStaff')
    node_label = ''.join(w.capitalize() for w in section_key.split('_'))

    conn = None
    try:
        conn = _get_connection(config)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Load AGE extension and set search path
        cur.execute('LOAD age;')
        cur.execute('SET search_path TO ag_catalog, "$user", public;')

        # Build Cypher query - use MATCH with WHERE clause
        # AGE returns results as a composite type, so we need to extract properties
        cypher = (
            "MATCH (n:{label} {{{prop}: $val, is_current_version: true}}) "
            "RETURN n"
        ).format(label=node_label, prop=field_key)

        # AGE uses a special function to execute Cypher
        age_query = 'SELECT * FROM cypher(%s, %s) AS (n agtype)'
        cur.execute(age_query, [graph_name, cypher.replace('$val', "'%{}%'".format(value.replace("'", "''")))])

        rows = cur.fetchall()
        cur.close()

        result = []
        for r in rows:
            # AGE returns node properties as agtype (JSON-like string)
            n_data = r.get('n', '{}')
            if isinstance(n_data, str):
                try:
                    row_dict = json.loads(n_data)
                    # AGE wraps properties under 'properties' key
                    if isinstance(row_dict, dict) and 'properties' in row_dict:
                        row_dict = row_dict['properties']
                except (ValueError, TypeError):
                    row_dict = {}
            elif isinstance(n_data, dict):
                row_dict = n_data.get('properties', n_data)
            else:
                row_dict = {}

            if row_dict:
                result.append({
                    'row': row_dict,
                    'label': _generate_label(row_dict),
                })

            if len(result) >= limit:
                break

        return result
    finally:
        if conn:
            try:
                conn.close()
            except Exception:
                pass


# =============================================================================
# Unified autocomplete entry point
# =============================================================================

def autocomplete(
    section_key: str,
    field_key: str,
    value: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Unified autocomplete: tries AGE if configured, falls back to SQL."""
    config = get_effective_pg_config()
    if not config:
        return []

    graph_name = config.get('graph_name', '')
    if graph_name:
        try:
            return autocomplete_from_age(config, section_key, field_key, value, limit)
        except Exception:
            # Fall back to SQL if AGE fails
            pass

    return autocomplete_from_pg(config, section_key, field_key, value, limit)


# =============================================================================
# Field mapping: DB column -> schema field key
# =============================================================================

# Fields eligible for DB autocomplete (pattern matching on field key)
AUTOCOMPLETE_FIELD_PATTERNS = [
    re.compile(r'inn$'),
    re.compile(r'ogrn$'),
    re.compile(r'full_name$'),
    re.compile(r'short_name$'),
    re.compile(r'reg_num$'),
    re.compile(r'_name$'),
    re.compile(r'_fio$'),
    re.compile(r'imo$'),
]


def is_autocomplete_field(field_def: Dict[str, Any]) -> bool:
    """Check if a field is eligible for DB autocomplete."""
    if field_def.get('readOnly') or field_def.get('virtual'):
        return False
    if field_def.get('type') != 'text':
        return False
    key = field_def.get('key', '')
    return any(p.search(key) for p in AUTOCOMPLETE_FIELD_PATTERNS)


def get_autocomplete_fields_for_section(section_def: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Get all autocomplete-eligible fields in a section."""
    return [f for f in section_def.get('fields', []) if is_autocomplete_field(f)]
