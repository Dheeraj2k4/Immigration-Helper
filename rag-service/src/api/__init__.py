"""API package initialization."""
from fastapi import APIRouter
from src.api.routes import chat, documents

# Create main API router
api_router = APIRouter(prefix="/api/v1")

# Include sub-routers
api_router.include_router(chat.router)
api_router.include_router(documents.router)

__all__ = ["api_router"]
