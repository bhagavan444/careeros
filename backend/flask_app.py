import sys
import traceback

def create_app():
    try:
        from a2wsgi import ASGIMiddleware
        from app.main import app as fastapi_app
        return ASGIMiddleware(fastapi_app)
    except Exception as e:
        print("CRITICAL ERROR BOOTING APP:", e, file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        raise

app = create_app()
