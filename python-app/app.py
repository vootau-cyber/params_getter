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
