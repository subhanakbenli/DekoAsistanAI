import logging
from logging.handlers import TimedRotatingFileHandler
import os
from .settings import settings

def setup_logging():
    """
    Set up logging configuration
    """
    # Create logs directory
    os.makedirs("logs", exist_ok=True)
    
    # Create TimedRotatingFileHandler
    log_handler = TimedRotatingFileHandler(
        settings.LOG_FILE,
        when="midnight",
        interval=1,
        backupCount=7,
        encoding="utf-8",
    )
    
    # Configure logging
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format=settings.LOG_FORMAT,
        handlers=[
            log_handler,
            logging.StreamHandler()  # Also log to console
        ]
    )
    
    return logging.getLogger(__name__)

# Get logger instance
logger = setup_logging()