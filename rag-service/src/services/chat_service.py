# -*- coding: utf-8 -*-
"""
Chat service for handling user queries.
"""
from typing import Optional
from loguru import logger
from src.core import RAGService
from src.models import ChatQueryRequest, ChatQueryResponse

GREETING_RESPONSES = {
    'en': "Hi there! 👋 I'm here to help with your visa and immigration questions. What would you like to know?",
    'es': "¡Hola! 👋 Estoy aquí para ayudarte con preguntas sobre visas e inmigración. ¿En qué puedo ayudarte?",
    'hi': "नमस्ते! 👋 मैं यहाँ आपके वीज़ा और आव्रजन सवालों में मदद के लिए हूँ। आप क्या जानना चाहते हैं?",
    'te': "నమస్కారం! 👋 వీసా మరియు ఇమ్మిగ్రేషన్ ప్రశ్నలలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీకు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
}


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
        
        language = request.language or 'en'

        try:
            # Quick response for greetings (language-aware)
            if self._is_greeting(request.query):
                greeting = GREETING_RESPONSES.get(language, GREETING_RESPONSES['en'])
                return ChatQueryResponse(
                    answer=greeting,
                    sources=[],
                    session_id=request.session_id,
                    confidence=1.0
                )
            
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
                return_sources=True,
                language=language
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
    
    def _is_greeting(self, query: str) -> bool:
        """
        Check if the query is a simple greeting.
        
        Args:
            query: User's query
            
        Returns:
            True if query is a greeting
        """
        greeting_words = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']
        query_lower = query.lower().strip()
        
        # Check if query is just a greeting (short message with greeting words)
        if len(query_lower.split()) <= 3:
            return any(greeting in query_lower for greeting in greeting_words)
        
        return False
    
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
