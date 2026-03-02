"""
Dependency injection for API routes.
Provides singleton instances of services.
"""
from functools import lru_cache
from src.core import DocumentLoader, VectorStoreManager, RAGService
from src.services import ChatService, DocumentService


# Global instances (initialized on first request)
_document_loader = None
_vector_store_manager = None
_rag_service = None
_chat_service = None
_document_service = None


def get_document_loader() -> DocumentLoader:
    """Get or create DocumentLoader instance."""
    global _document_loader
    if _document_loader is None:
        _document_loader = DocumentLoader()
    return _document_loader


def get_vector_store_manager() -> VectorStoreManager:
    """Get or create VectorStoreManager instance."""
    global _vector_store_manager
    if _vector_store_manager is None:
        _vector_store_manager = VectorStoreManager()
    return _vector_store_manager


def get_rag_service() -> RAGService:
    """Get or create RAGService instance."""
    global _rag_service
    if _rag_service is None:
        vector_store = get_vector_store_manager()
        _rag_service = RAGService(vector_store)
    return _rag_service


def get_chat_service() -> ChatService:
    """Get or create ChatService instance."""
    global _chat_service
    if _chat_service is None:
        rag_service = get_rag_service()
        _chat_service = ChatService(rag_service)
    return _chat_service


def get_document_service() -> DocumentService:
    """Get or create DocumentService instance."""
    global _document_service
    if _document_service is None:
        document_loader = get_document_loader()
        vector_store = get_vector_store_manager()
        _document_service = DocumentService(document_loader, vector_store)
    return _document_service
