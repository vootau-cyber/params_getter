# -*- coding: utf-8 -*-
"""
API routes for maritime security data entry backend.
All endpoints for schema, data CRUD, versioning, import/export, reset.
"""

import json

from flask import Blueprint, request, jsonify, Response

from app import schema
from app import storage


api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/schema', methods=['GET'])
def get_schema():
    """Return SCHEMA_SECTIONS and groups as JSON (for frontend to use)."""
    return jsonify({
        'sections': schema.SCHEMA_SECTIONS,
        'groups': schema.get_section_groups(),
    })


@api_bp.route('/data', methods=['GET'])
def get_data():
    """Load current data."""
    data = storage.load_current_data()
    return jsonify(data)


@api_bp.route('/data', methods=['POST'])
def post_data():
    """Save data (JSON body: {data: {...}, author: {name, role}})."""
    body = request.get_json(force=True, silent=True)
    if body is None:
        return jsonify({'error': 'Invalid JSON body'}), 400

    data = body.get('data')
    if data is None:
        return jsonify({'error': 'Missing "data" field in request body'}), 400

    author = body.get('author', {})
    author_name = author.get('name', 'Unknown')
    author_role = author.get('role', 'Unknown')

    result = storage.save_data(data, author_name, author_role)
    return jsonify(result)


@api_bp.route('/versions', methods=['GET'])
def get_versions():
    """List versions."""
    versions = storage.get_versions()
    return jsonify(versions)


@api_bp.route('/versions/<int:version_id>', methods=['GET'])
def get_version(version_id):
    """Load version data."""
    data = storage.load_version_data(version_id)
    if data is None:
        return jsonify({'error': 'Version not found'}), 404
    return jsonify(data)


@api_bp.route('/import', methods=['POST'])
def import_data():
    """Import JSON file (multipart upload)."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        raw = file.read().decode('utf-8')
        data = json.loads(raw)
    except (UnicodeDecodeError, ValueError) as e:
        return jsonify({'error': 'Invalid JSON file: {}'.format(str(e))}), 400

    if not isinstance(data, dict):
        return jsonify({'error': 'JSON file must contain an object at the top level'}), 400

    author = request.form.get('author_name', 'Import')
    author_role = request.form.get('author_role', 'Import')

    result = storage.save_data(data, author, author_role)
    return jsonify(result)


@api_bp.route('/export', methods=['GET'])
def export_data():
    """Export as JSON file download."""
    json_str = storage.export_json()
    return Response(
        json_str,
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment; filename=maritime_data_export.json'},
    )


@api_bp.route('/reset', methods=['POST'])
def reset_data():
    """Reset to seed."""
    storage.reset_to_seed()
    data = storage.load_current_data()
    return jsonify({'ok': True, 'data': data})
