import logging
import json
import os
import contextvars
from datetime import datetime
from logging.handlers import RotatingFileHandler

# Global context variables for logging
request_id_ctx_var = contextvars.ContextVar('request_id', default=None)
user_id_ctx_var = contextvars.ContextVar('user_id', default=None)

class JSONFormatter(logging.Formatter):
    def __init__(self, service_name: str = "careeros_api"):
        super().__init__()
        self.service_name = service_name
        self.env = os.getenv("ENVIRONMENT", "development")

    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "service": self.service_name,
            "environment": self.env,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include context variables if present
        request_id = request_id_ctx_var.get()
        if request_id:
            log_obj["request_id"] = request_id
            
        user_id = user_id_ctx_var.get()
        if user_id:
            log_obj["user_id"] = user_id

        # Include exception traceback if present
        if record.exc_info:
            log_obj["traceback"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)

def setup_logging():
    """
    Configures centralized logging for the entire application.
    Sets up JSON formatting and log rotation.
    """
    # Ensure logs directory exists
    log_dir = os.path.join(os.getcwd(), "logs")
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, "careeros.log")
    
    # Create Handlers
    console_handler = logging.StreamHandler()
    file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
    
    # Create Formatter
    json_formatter = JSONFormatter()
    console_handler.setFormatter(json_formatter)
    file_handler.setFormatter(json_formatter)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove any existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
    
    # Adjust third-party loggers
    logging.getLogger("uvicorn.access").handlers = [console_handler, file_handler]
    logging.getLogger("uvicorn.error").handlers = [console_handler, file_handler]
    
    root_logger.info("Structured JSON Logging initialized.")
