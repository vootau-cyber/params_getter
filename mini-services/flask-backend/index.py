#!/usr/bin/env python3
"""Mini service: Flask backend for maritime security data entry."""
import os
import sys

# Add parent directory to path so we can import the app module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

if __name__ == '__main__':
    app.config['DEBUG'] = False
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
