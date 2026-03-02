"""
Pydantic models for API request/response schemas.
"""
from typing import Optional, List, Any
from pydantic import BaseModel, Field


class ChatQueryRequest(BaseModel):
    """Request model for chat queries."""
    query: str = Field(..., min_length=1, max_length=1000, description="User question about visa/immigration")
    session_id: Optional[str] = Field(None, description="Optional session ID for conversation tracking")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "query": "What documents do I need for H1B visa?",
                    "session_id": "user-123-session"
                }
            ]
        }
    }


class SourceDocument(BaseModel):
    """Model for source document metadata."""
    content: str = Field(..., description="Relevant text chunk from document")
    source: str = Field(..., description="Source document name")
    page: Optional[int] = Field(None, description="Page number if applicable")
    score: Optional[float] = Field(None, description="Relevance score")


class ChatQueryResponse(BaseModel):
    """Response model for chat queries."""
    answer: str = Field(..., description="Generated answer to the query")
    sources: List[SourceDocument] = Field(default_factory=list, description="Source documents used")
    session_id: Optional[str] = Field(None, description="Session ID if provided")
    confidence: Optional[float] = Field(None, description="Confidence score of the answer")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "answer": "For H1B visa, you typically need...",
                    "sources": [
                        {
                            "content": "H1B visa requirements include...",
                            "source": "h1b_guide.pdf",
                            "page": 3,
                            "score": 0.95
                        }
                    ],
                    "session_id": "user-123-session",
                    "confidence": 0.92
                }
            ]
        }
    }


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    vector_store_initialized: bool = Field(..., description="Whether vector store is ready")
    document_count: int = Field(default=0, description="Number of documents in vector store")


class DocumentUploadResponse(BaseModel):
    """Response for document upload."""
    success: bool = Field(..., description="Whether upload was successful")
    message: str = Field(..., description="Status message")
    filename: str = Field(..., description="Uploaded filename")
    chunks_created: int = Field(default=0, description="Number of chunks created from document")


class DocumentInfo(BaseModel):
    """Information about a document in the vector store."""
    filename: str = Field(..., description="Document filename")
    chunk_count: int = Field(default=0, description="Number of chunks")
    uploaded_at: Optional[Any] = Field(None, description="Upload timestamp")


class DocumentListResponse(BaseModel):
    """Response for listing documents."""
    documents: List[DocumentInfo] = Field(default_factory=list, description="List of documents")
    total_count: int = Field(..., description="Total document count")


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
