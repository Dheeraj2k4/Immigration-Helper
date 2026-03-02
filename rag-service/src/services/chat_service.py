"""
Chat service for handling user queries.
"""
from typing import Optional
from loguru import logger
from src.core import RAGService
from src.models import ChatQueryRequest, ChatQueryResponse


class ChatService:
    """Service for handling chat queries."""
    
    def __init__(self, rag_service: RAGService):
        """
        Initialize chat service.
        
        Args:
            rag_service: RAGService instance
        """
        self.rag_service = rag_service
    
    async def process_query(self, request: ChatQueryRequest) -> ChatQueryResponse:
        """
        Process a user query and generate response.
        
        Args:
            request: Chat query request
            
        Returns:
            ChatQueryResponse with answer and sources
        """
        logger.info(f"Processing chat query (session: {request.session_id})")
        
        try:
            # Check if RAG service is ready
            if not self.rag_service.is_ready():
                logger.warning("RAG service not ready - no documents loaded")
                return ChatQueryResponse(
                    answer="I'm not ready to answer questions yet. Please ensure documents have been uploaded and processed.",
                    sources=[],
                    session_id=request.session_id,
                    confidence=0.0
                )
            
            # Query RAG system
            answer, sources = self.rag_service.query(
                question=request.query,
                return_sources=True
            )
            
            # Calculate confidence based on source scores
            confidence = self._calculate_confidence(sources)
            
            return ChatQueryResponse(
                answer=answer,
                sources=sources,
                session_id=request.session_id,
                confidence=confidence
            )
            
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return ChatQueryResponse(
                answer="I encountered an error processing your question. Please try again or rephrase your query.",
                sources=[],
                session_id=request.session_id,
                confidence=0.0
            )
    
    def _calculate_confidence(self, sources) -> Optional[float]:
        """
        Calculate confidence score based on source relevance.
        
        Args:
            sources: List of source documents
            
        Returns:
            Confidence score between 0 and 1
        """
        if not sources:
            return 0.0
        
        # Average the scores of retrieved sources
        scores = [s.score for s in sources if s.score is not None]
        if not scores:
            return None
        
        # Normalize and average (assuming scores are distances, lower is better)
        # This logic may need adjustment based on actual score semantics
        avg_score = sum(scores) / len(scores)
        # Convert to confidence (0-1 range), adjust as needed
        confidence = max(0.0, min(1.0, 1.0 - (avg_score / 2.0)))
        
        return round(confidence, 2)
