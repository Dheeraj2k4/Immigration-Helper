"""
Chat API endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from loguru import logger
from src.models import ChatQueryRequest, ChatQueryResponse
from src.services import ChatService
from src.api.dependencies import get_chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/query", response_model=ChatQueryResponse)
async def query_chat(
    request: ChatQueryRequest,
    chat_service: ChatService = Depends(get_chat_service)
) -> ChatQueryResponse:
    """
    Query the RAG chatbot with a question about visa/immigration.
    
    - **query**: The user's question
    - **session_id**: Optional session identifier for conversation tracking
    
    Returns the answer along with source documents and confidence score.
    """
    try:
        response = await chat_service.process_query(request)
        return response
    except Exception as e:
        logger.error(f"Error in chat query endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred processing your query"
        )


@router.get("/health")
async def chat_health():
    """Check if chat service is operational."""
    return {"status": "operational", "service": "chat"}
