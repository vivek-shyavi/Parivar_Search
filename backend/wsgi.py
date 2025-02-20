from waitress import serve
from app import app  # Import your Flask app and SocketIO

# This file serves as the entry point for Gunicorn
if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)