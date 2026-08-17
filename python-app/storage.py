# =============================================================================
# File-based JSON storage with versioning
# Ported from TypeScript lib/storage.ts
# =============================================================================

from __future__ import annotations

import json
import os
import copy
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from schema import SCHEMA_SECTIONS

DATA_DIR = 'data'
CURRENT_FILE = 'data/current.json'
VERSIONS_DIR = 'data/versions'
VERSIONS_MANIFEST = 'data/versions.json'
SEED_FILE = 'seed/seed_domain_data_full.json'


def ensure_data_dir() -> None:
    """Create data directories if they don't exist."""
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(VERSIONS_DIR, exist_ok=True)


def read_json_file(path: str) -> Optional[Any]:
    """Read and parse a JSON file. Returns None on FileNotFoundError."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError:
        return None


def detect_changed_sections(old: Dict, new: Dict) -> List[str]:
    """Compare top-level keys between old and new data dicts.

    Returns list of section keys that changed (added, removed, or value changed).
    """
    changed = []
    all_keys = set(list(old.keys()) + list(new.keys()))
    for key in all_keys:
        old_json = json.dumps(old.get(key), ensure_ascii=False, sort_keys=True)
        new_json = json.dumps(new.get(key), ensure_ascii=False, sort_keys=True)
        if old_json != new_json:
            changed.append(key)
    return sorted(changed)


def _get_all_section_keys() -> List[str]:
    """Return all 30 schema section keys in order."""
    return [s['key'] for s in SCHEMA_SECTIONS]


def migrate_data(data: Dict) -> Dict:
    """Ensure all 30 schema section keys exist in the data dict.

    Missing sections are initialized with an empty list.
    """
    all_keys = _get_all_section_keys()
    for key in all_keys:
        if key not in data:
            data[key] = []
    return data


def load_current_data() -> Dict:
    """Load current data from current.json.

    If current.json is missing, initialize from seed file.
    Returns the full data dict.
    """
    ensure_data_dir()
    data = read_json_file(CURRENT_FILE)
    if data is not None:
        return migrate_data(data)

    # Initialize from seed
    seed = read_json_file(SEED_FILE)
    if seed is not None:
        data = copy.deepcopy(seed)
    else:
        # No seed available, create empty structure
        data = {}
        for section in SCHEMA_SECTIONS:
            data[section['key']] = []

    data = migrate_data(data)
    _write_json_file(CURRENT_FILE, data)
    return data


def _write_json_file(path: str, data: Any) -> None:
    """Write data to a JSON file with pretty-printing."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def save_data(data: Dict, author_name: str = '', author_role: str = '') -> Dict:
    """Save data to current.json and create a version snapshot.

    Args:
        data: The full data dict to save.
        author_name: Name of the person saving.
        author_role: Role of the person saving.

    Returns:
        Dict with version metadata (id, timestamp, version, changed_sections, etc.).
    """
    ensure_data_dir()

    # Read old data for comparison
    old_data = read_json_file(CURRENT_FILE)
    if old_data is None:
        old_data = {}

    # Detect changes
    changed_sections = detect_changed_sections(old_data, data)

    # Migrate data to ensure all sections present
    data = migrate_data(data)

    # Generate version info
    now = datetime.now(timezone.utc)
    version_id = str(uuid.uuid4())
    timestamp = now.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

    # Load versions manifest
    manifest = read_json_file(VERSIONS_MANIFEST)
    if manifest is None:
        manifest = []

    version_number = len(manifest) + 1
    version_label = 'Версия {}'.format(version_number)

    # Data file for this version
    data_file = os.path.join(VERSIONS_DIR, '{}.json'.format(version_id))

    # Create version entry
    version_entry = {
        'id': version_id,
        'timestamp': timestamp,
        'author_name': author_name,
        'author_role': author_role,
        'changed_sections': changed_sections,
        'version_label': version_label,
        'version': version_number,
        'data_file': data_file,
    }

    # Save current data
    _write_json_file(CURRENT_FILE, data)

    # Save version snapshot
    _write_json_file(data_file, data)

    # Update manifest
    manifest.append(version_entry)
    _write_json_file(VERSIONS_MANIFEST, manifest)

    return version_entry


def get_versions() -> List[Dict]:
    """Return list of version metadata entries.

    Each entry is a dict with id, timestamp, author_name, author_role,
    changed_sections, version_label, version, data_file.
    """
    ensure_data_dir()
    manifest = read_json_file(VERSIONS_MANIFEST)
    if manifest is None:
        return []
    return manifest


def load_version_data(version_id: str) -> Optional[Dict]:
    """Load data for a specific version by its ID.

    Args:
        version_id: The UUID of the version to load.

    Returns:
        The data dict for that version, or None if not found.
    """
    ensure_data_dir()
    data_file = os.path.join(VERSIONS_DIR, '{}.json'.format(version_id))
    data = read_json_file(data_file)
    if data is None:
        return None
    return migrate_data(data)


def export_json() -> str:
    """Return current data as a JSON string."""
    data = load_current_data()
    return json.dumps(data, ensure_ascii=False, indent=2)


def reset_to_seed() -> Dict:
    """Reset current.json to the seed data.

    Returns the version entry for this reset operation.
    """
    ensure_data_dir()

    # Read seed
    seed = read_json_file(SEED_FILE)
    if seed is not None:
        data = copy.deepcopy(seed)
    else:
        # No seed available, create empty structure
        data = {}
        for section in SCHEMA_SECTIONS:
            data[section['key']] = []

    data = migrate_data(data)

    # Save as a new version (system reset)
    return save_data(data, 'Система', 'Сброс к начальным данным')


def import_data(data: Dict, author_name: str = '', author_role: str = '') -> Dict:
    """Import data from an external JSON, replacing current data.

    Args:
        data: The imported data dict.
        author_name: Name of the person importing.
        author_role: Role of the person importing.

    Returns:
        Version entry for the import.
    """
    ensure_data_dir()
    data = migrate_data(data)
    return save_data(data, author_name, author_role)
