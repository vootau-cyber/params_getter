# -*- coding: utf-8 -*-
"""Flask app entry point for maritime security data entry backend."""

import os

from flask import Flask, send_from_directory

from app.routes.api import api_bp

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

app = Flask(__name__)
app.register_blueprint(api_bp)


@app.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')


@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory(STATIC_DIR, path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
