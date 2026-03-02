"""
Logging configuration using loguru.
"""
import sys
from loguru import logger
from src.config import settings


def setup_logging():
    """
    Configure logging for the application.
    """
    # Remove default logger
    logger.remove()
    
    # Add console logger with custom format
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
        level=settings.log_level,
        colorize=True,
    )
    
    # Add file logger for production
    if settings.api_env == "production":
        logger.add(
            "logs/app_{time:YYYY-MM-DD}.log",
            rotation="00:00",  # Rotate at midnight
            retention="30 days",  # Keep logs for 30 days
            level="INFO",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function} - {message}",
        )
    
    logger.info(f"Logging configured with level: {settings.log_level}")
