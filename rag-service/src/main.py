"""
Main FastAPI application.
"""
import sys
from pathlib import Path

# Add parent directory to path so imports work when running directly
sys.path.insert(0, str(Path(__file__).parent.parent))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from src.config import settings
from src.utils import setup_logging
from src.api import api_router
from src.api.dependencies import get_vector_store_manager
from src.models import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting RAG Service...")
    setup_logging()
    
    # Initialize vector store
    try:
        vector_store = get_vector_store_manager()
        doc_count = vector_store.get_document_count()
        logger.info(f"Vector store initialized with {doc_count} documents")
    except Exception as e:
        logger.warning(f"Vector store initialization warning: {str(e)}")
    
    logger.info("RAG Service started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down RAG Service...")


# Create FastAPI app
app = FastAPI(
    title="Immigration Helper - RAG Chatbot Service",
    description="Retrieval-Augmented Generation service for visa and immigration assistance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint with service information."""
    return {
        "service": "Immigration Helper RAG Chatbot",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """
    Health check endpoint.
    Returns service status and vector store information.
    """
    try:
        vector_store = get_vector_store_manager()
        doc_count = vector_store.get_document_count()
        is_initialized = doc_count > 0
        
        return HealthResponse(
            status="healthy",
            version="1.0.0",
            vector_store_initialized=is_initialized,
            document_count=doc_count
        )
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return HealthResponse(
            status="degraded",
            version="1.0.0",
            vector_store_initialized=False,
            document_count=0
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_env == "development"
    )
