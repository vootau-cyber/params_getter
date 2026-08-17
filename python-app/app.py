# =============================================================================
# Flask application — Russian maritime security data entry
# Python 3.8 compatible
# =============================================================================

from __future__ import annotations

import json
import io
import os
from typing import Any, Dict, Tuple

from flask import (
    Flask,
    jsonify,
    request,
    render_template,
    Response,
)
from flask_cors import CORS

import storage
from schema import SCHEMA_SECTIONS, get_section_groups
import db_connection


def create_app() -> Flask:
    """Flask application factory."""
    app = Flask(
        __name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static',
    )
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB upload limit

    CORS(app)

    # ------------------------------------------------------------------
    # Main page
    # ------------------------------------------------------------------
    @app.route('/')
    def index() -> str:
        return render_template('index.html')

    # ------------------------------------------------------------------
    # API: Data
    # ------------------------------------------------------------------
    @app.route('/api/data', methods=['GET'])
    def api_get_data() -> Tuple[Response, int]:
        """Load current data and return as JSON."""
        data = storage.load_current_data()
        return jsonify(data), 200

    @app.route('/api/data', methods=['POST'])
    def api_save_data() -> Tuple[Response, int]:
        """Save data. Body: {'data': {...}, 'author': {'name': '...', 'role': '...'}}

        Returns: {'version': N, 'timestamp': '...', 'changed_sections': [...]}
        """
        body = request.get_json(silent=True)
        if not body or 'data' not in body:
            return jsonify({'error': 'Требуется поле \'data\' в теле запроса'}), 400

        data = body['data']
        if not isinstance(data, dict):
            return jsonify({'error': 'Поле \'data\' должно быть объектом'}), 400

        author = body.get('author', {})
        author_name = author.get('name', '') if isinstance(author, dict) else ''
        author_role = author.get('role', '') if isinstance(author, dict) else ''

        version_info = storage.save_data(data, author_name, author_role)

        return jsonify({
            'version': version_info['version'],
            'timestamp': version_info['timestamp'],
            'changed_sections': version_info['changed_sections'],
        }), 200

    # ------------------------------------------------------------------
    # API: Versions
    # ------------------------------------------------------------------
    @app.route('/api/versions', methods=['GET'])
    def api_get_versions() -> Tuple[Response, int]:
        """List version metadata."""
        versions = storage.get_versions()
        # Strip internal data_file path from response
        clean_versions = []
        for v in versions:
            clean_versions.append({
                'id': v['id'],
                'timestamp': v['timestamp'],
                'author_name': v['author_name'],
                'author_role': v['author_role'],
                'changed_sections': v['changed_sections'],
                'version_label': v['version_label'],
                'version': v['version'],
            })
        return jsonify(clean_versions), 200

    @app.route('/api/versions/<version_id>', methods=['GET'])
    def api_get_version(version_id: str) -> Tuple[Response, int]:
        """Load data for a specific version."""
        data = storage.load_version_data(version_id)
        if data is None:
            return jsonify({'error': 'Версия не найдена'}), 404
        return jsonify(data), 200

    # ------------------------------------------------------------------
    # API: Import
    # ------------------------------------------------------------------
    @app.route('/api/import', methods=['POST'])
    def api_import() -> Tuple[Response, int]:
        """Multipart file upload, parse JSON, replace current data, save version."""
        if 'file' not in request.files:
            return jsonify({'error': 'Файл не найден в запросе'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Файл не выбран'}), 400

        try:
            file_content = file.read().decode('utf-8')
            data = json.loads(file_content)
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            return jsonify({'error': 'Неверный формат JSON: {}'.format(str(e))}), 400

        if not isinstance(data, dict):
            return jsonify({'error': 'JSON файл должен содержать объект'}), 400

        # Get author info from form data
        author_name = request.form.get('author_name', '')
        author_role = request.form.get('author_role', '')

        version_info = storage.import_data(data, author_name, author_role)

        return jsonify({
            'version': version_info['version'],
            'timestamp': version_info['timestamp'],
            'changed_sections': version_info['changed_sections'],
        }), 200

    # ------------------------------------------------------------------
    # API: Reset
    # ------------------------------------------------------------------
    @app.route('/api/reset', methods=['POST'])
    def api_reset() -> Tuple[Response, int]:
        """Reset current data to seed."""
        version_info = storage.reset_to_seed()
        return jsonify({
            'version': version_info['version'],
            'timestamp': version_info['timestamp'],
            'changed_sections': version_info['changed_sections'],
        }), 200

    # ------------------------------------------------------------------
    # API: Export
    # ------------------------------------------------------------------
    @app.route('/api/export', methods=['GET'])
    def api_export() -> Response:
        """Download current data as a JSON file."""
        json_str = storage.export_json()
        buf = io.BytesIO(json_str.encode('utf-8'))
        return Response(
            buf,
            mimetype='application/json',
            headers={
                'Content-Disposition': 'attachment; filename=maritime_security_data.json',
            },
        )

    # ------------------------------------------------------------------
    # API: Schema
    # ------------------------------------------------------------------
    @app.route('/api/schema', methods=['GET'])
    def api_get_schema() -> Tuple[Response, int]:
        """Return schema with sections and groups for frontend consumption."""
        groups = get_section_groups()
        return jsonify({'sections': SCHEMA_SECTIONS, 'groups': groups}), 200

    # ------------------------------------------------------------------
    # API: DB Connection — Get current config
    # ------------------------------------------------------------------
    @app.route('/api/db-config', methods=['GET'])
    def api_get_db_config() -> Tuple[Response, int]:
        """Return current PostgreSQL config (password masked)."""
        config = db_connection.get_effective_pg_config()
        if not config:
            return jsonify({'postgresql': None}), 200
        # Mask password for security
        masked = dict(config)
        if masked.get('password'):
            masked['password'] = '********'
        return jsonify({'postgresql': masked}), 200

    # ------------------------------------------------------------------
    # API: DB Connection — Save config
    # ------------------------------------------------------------------
    @app.route('/api/db-config', methods=['PUT'])
    def api_save_db_config() -> Tuple[Response, int]:
        """Save PostgreSQL connection config."""
        body = request.get_json(silent=True)
        if not body:
            return jsonify({'error': 'Тело запроса отсутствует'}), 400

        required = ['host', 'port', 'database', 'username', 'password']
        for key in required:
            if key not in body:
                return jsonify({'error': 'Отсутствует обязательное поле: {}'.format(key)}), 400

        config = {
            'host': str(body['host']).strip(),
            'port': int(body['port']),
            'database': str(body['database']).strip(),
            'username': str(body['username']).strip(),
            'password': str(body['password']),
            'ssl': bool(body.get('ssl', False)),
            'graph_name': str(body.get('graph_name', '')).strip(),
        }

        # Validate port range
        if not (1 <= config['port'] <= 65535):
            return jsonify({'error': 'Порт должен быть от 1 до 65535'}), 400

        db_connection.save_pg_config(config)
        masked = dict(config)
        if masked['password']:
            masked['password'] = '********'
        return jsonify({'postgresql': masked}), 200

    # ------------------------------------------------------------------
    # API: DB Connection — Delete config
    # ------------------------------------------------------------------
    @app.route('/api/db-config', methods=['DELETE'])
    def api_delete_db_config() -> Tuple[Response, int]:
        """Delete saved PostgreSQL config."""
        db_connection.delete_pg_config()
        return jsonify({'postgresql': None}), 200

    # ------------------------------------------------------------------
    # API: DB Connection — Test
    # ------------------------------------------------------------------
    @app.route('/api/db-config/test', methods=['POST'])
    def api_test_db_config() -> Tuple[Response, int]:
        """Test PostgreSQL connection."""
        # Use the body config if provided, otherwise use saved config
        body = request.get_json(silent=True)
        if body and body.get('host'):
            config = body
        else:
            config = db_connection.get_effective_pg_config()
            if not config:
                return jsonify({'ok': False, 'error': 'Подключение PostgreSQL не настроено'}), 400

        result = db_connection.test_pg_connection(config)
        status_code = 200 if result['ok'] else 400
        return jsonify(result), status_code

    # ------------------------------------------------------------------
    # API: DB Autocomplete
    # ------------------------------------------------------------------
    @app.route('/api/autocomplete', methods=['POST'])
    def api_autocomplete() -> Tuple[Response, int]:
        """DB-powered autocomplete for a field value.

        Body: {'sectionKey': str, 'fieldKey': str, 'value': str, 'limit'?: int}
        Returns: [{'row': {...}, 'label': '...'}, ...]
        """
        body = request.get_json(silent=True)
        if not body:
            return jsonify({'error': 'Тело запроса отсутствует'}), 400

        section_key = body.get('sectionKey', '').strip()
        field_key = body.get('fieldKey', '').strip()
        value = body.get('value', '').strip()
        limit = body.get('limit', 10)

        if not section_key or not field_key or not value:
            return jsonify({
                'error': 'Отсутствуют обязательные поля (sectionKey, fieldKey, value)',
            }), 400

        if len(value) < 2:
            return jsonify([]), 200

        try:
            matches = db_connection.autocomplete(
                section_key=section_key,
                field_key=field_key,
                value=value,
                limit=int(limit),
            )
            return jsonify(matches), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # ------------------------------------------------------------------
    # API: DB Status (for UI indicator)
    # ------------------------------------------------------------------
    @app.route('/api/db-status', methods=['GET'])
    def api_db_status() -> Tuple[Response, int]:
        """Return DB connection status (configured / not configured)."""
        config = db_connection.get_effective_pg_config()
        if not config:
            return jsonify({
                'configured': False,
                'source': None,
                'graph_name': '',
            }), 200

        # Determine source
        env_config = db_connection.get_pg_config_from_env()
        source = 'env' if env_config else 'file'

        return jsonify({
            'configured': True,
            'source': source,
            'graph_name': config.get('graph_name', ''),
            'host': config.get('host', ''),
            'database': config.get('database', ''),
        }), 200

    # ------------------------------------------------------------------
    # Error handlers
    # ------------------------------------------------------------------
    @app.errorhandler(404)
    def not_found(e: Any) -> Tuple[Response, int]:
        return jsonify({'error': 'Не найдено'}), 404

    @app.errorhandler(500)
    def internal_error(e: Any) -> Tuple[Response, int]:
        return jsonify({'error': 'Внутренняя ошибка сервера'}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
