# -*- coding: utf-8 -*-
"""
File-based JSON storage with versioning for maritime security data.
Ported from src/lib/storage.ts.
"""

import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.schema import get_known_section_keys


# ── Paths ────────────────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
CURRENT_FILE = os.path.join(DATA_DIR, 'current.json')
VERSIONS_DIR = os.path.join(DATA_DIR, 'versions')
VERSIONS_MANIFEST = os.path.join(DATA_DIR, 'versions.json')
SEED_FILE = os.path.join(BASE_DIR, 'seed', 'seed_domain_data_full.json')


# ── Helpers ──────────────────────────────────────────────────────────────────


def ensure_data_dir():
    # type: () -> None
    """Creates data/ and data/versions/ directories if they don't exist."""
    if not os.path.exists(VERSIONS_DIR):
        os.makedirs(VERSIONS_DIR, exist_ok=True)
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)


def _read_json_file(filepath):
    # type: (str) -> Optional[Any]
    """Reads and parses a JSON file, returns None on ENOENT."""
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def _write_json_file(filepath, data):
    # type: (str, Any) -> None
    """Writes data as pretty-printed JSON."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def detect_changed_sections(old_data, new_data):
    # type: (Dict[str, Any], Dict[str, Any]) -> List[str]
    """Detects which top-level keys changed between two data snapshots."""
    all_keys = set(list(old_data.keys()) + list(new_data.keys()))
    changed = []
    for key in all_keys:
        old_json = json.dumps(old_data.get(key, []), sort_keys=True, ensure_ascii=False)
        new_json = json.dumps(new_data.get(key, []), sort_keys=True, ensure_ascii=False)
        if old_json != new_json:
            changed.append(key)
    return changed


def migrate_data(data):
    # type: (Dict[str, Any]) -> Dict[str, Any]
    """Ensures all current schema section keys exist in the data."""
    migrated = dict(data)

    # If old "contracts" key exists from a previous version, split it back
    if 'contracts' in migrated and 'ptb_contracts' not in migrated:
        contracts = migrated.get('contracts') or []
        ptb_contracts = []
        maintenance_contracts = []

        for row in contracts:
            if row.get('contract_type') == 'Техническое обслуживание' or row.get('contract_provider') or row.get('contract_scope'):
                maintenance_contracts.append({
                    'oti_ref': row.get('oti_ref'),
                    'ptb_ref': row.get('ptb_ref'),
                    'contract_name': row.get('contract_name', ''),
                    'contract_num': row.get('contract_num', ''),
                    'contract_date': row.get('contract_date'),
                    'contract_exp_date': row.get('contract_exp_date'),
                    'contract_provider': row.get('contract_provider', ''),
                    'contract_scope': row.get('contract_scope', ''),
                    'contract_is_active': row.get('contract_is_active', True),
                })
            else:
                ptb_contracts.append({
                    'ptb_ref': row.get('ptb_ref'),
                    'contract_name': row.get('contract_name', ''),
                    'contract_num': row.get('contract_num', ''),
                    'contract_date': row.get('contract_date'),
                    'contract_exp_date': row.get('contract_exp_date'),
                    'is_prolonged': row.get('is_prolonged', False),
                    'prolongation_date': row.get('prolongation_date'),
                    'prolongation_new_exp_date': row.get('prolongation_new_exp_date'),
                    'contract_is_maintenance': row.get('contract_is_maintenance', False),
                })

        migrated['ptb_contracts'] = ptb_contracts
        migrated['maintenance_contracts'] = maintenance_contracts
        del migrated['contracts']

    # Ensure all current schema section keys exist
    known_keys = get_known_section_keys()
    for key in known_keys:
        if key not in migrated:
            migrated[key] = []

    return migrated


# ── Core functions ───────────────────────────────────────────────────────────


def load_current_data():
    # type: () -> Dict[str, Any]
    """
    Loads current data from data/current.json.
    If the file doesn't exist, initialises from the seed template and returns it.
    """
    ensure_data_dir()

    existing = _read_json_file(CURRENT_FILE)
    if existing is not None:
        return migrate_data(existing)

    # Initialise from seed
    with open(SEED_FILE, 'r', encoding='utf-8') as f:
        seed = json.load(f)
    # Strip meta section — it's not part of the data schema
    if 'meta' in seed:
        del seed['meta']
    migrated = migrate_data(seed)
    _write_json_file(CURRENT_FILE, migrated)
    return migrated


def save_data(data, author_name, author_role):
    # type: (Dict[str, Any], str, str) -> Dict[str, Any]
    """
    Saves current data, creates a version snapshot, appends to versions manifest.
    Returns version metadata dict.
    """
    ensure_data_dir()

    old_data = _read_json_file(CURRENT_FILE)
    is_first_save = old_data is None
    if is_first_save:
        changed_sections = list(data.keys())
    else:
        changed_sections = detect_changed_sections(old_data, data)

    # Load / create versions manifest
    versions = _read_json_file(VERSIONS_MANIFEST)
    if versions is None:
        versions = []

    if len(versions) > 0:
        next_id = max(v['id'] for v in versions) + 1
    else:
        next_id = 1

    timestamp = datetime.utcnow().isoformat() + 'Z'
    version_entry = {
        'id': next_id,
        'timestamp': timestamp,
        'author_name': author_name,
        'author_role': author_role,
        'changed_sections': changed_sections,
        'version_label': 'Версия {}'.format(next_id),
        'data_file': 'versions/v_{}.json'.format(next_id),
    }

    # Write snapshot
    snapshot_path = os.path.join(DATA_DIR, version_entry['data_file'])
    _write_json_file(snapshot_path, data)

    # Append to manifest
    versions.append(version_entry)
    _write_json_file(VERSIONS_MANIFEST, versions)

    # Overwrite current
    _write_json_file(CURRENT_FILE, data)

    return {
        'version': next_id,
        'timestamp': timestamp,
        'changed_sections': changed_sections,
    }


def get_versions():
    # type: () -> List[Dict[str, Any]]
    """Returns list of all versions (metadata only)."""
    ensure_data_dir()
    versions = _read_json_file(VERSIONS_MANIFEST)
    return versions if versions is not None else []


def get_version(version_id):
    # type: (int) -> Optional[Dict[str, Any]]
    """Returns a specific version entry, or None if not found."""
    versions = get_versions()
    for v in versions:
        if v['id'] == version_id:
            return v
    return None


def load_version_data(version_id):
    # type: (int) -> Optional[Dict[str, Any]]
    """Loads the full data snapshot for a given version id."""
    entry = get_version(version_id)
    if entry is None:
        return None

    snapshot_path = os.path.join(DATA_DIR, entry['data_file'])
    data = _read_json_file(snapshot_path)
    if data is None:
        return None
    return migrate_data(data)


def export_json():
    # type: () -> str
    """Returns the current data as a pretty-printed JSON string."""
    data = load_current_data()
    return json.dumps(data, ensure_ascii=False, indent=2)


def reset_to_seed():
    # type: () -> None
    """Resets current.json back to the seed template (migrated)."""
    ensure_data_dir()
    with open(SEED_FILE, 'r', encoding='utf-8') as f:
        seed = json.load(f)
    if 'meta' in seed:
        del seed['meta']
    migrated = migrate_data(seed)
    _write_json_file(CURRENT_FILE, migrated)
