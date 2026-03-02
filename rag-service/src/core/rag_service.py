"""
RAG (Retrieval-Augmented Generation) service.
Orchestrates document retrieval and LLM-based response generation.
"""
from typing import List, Tuple
from langchain_ollama import OllamaLLM
try:
    from langchain_core.prompts import PromptTemplate
except ImportError:
    from langchain.prompts import PromptTemplate
try:
    from langchain_core.documents import Document
except ImportError:
    from langchain.schema import Document
from loguru import logger
from src.config import settings
from src.core.vector_store import VectorStoreManager
from src.models import SourceDocument


class RAGService:
    """Service for RAG-based question answering."""
    
    # System prompt template for visa/immigration assistance
    PROMPT_TEMPLATE = """You are an expert immigration assistant specializing in visa, passport, and immigration processes. 
Your role is to provide accurate, helpful, and detailed information based on the official documentation provided.

Use the following context from official documents to answer the question. If the answer is not in the context, 
clearly state that you don't have that information in the current documentation and suggest where they might find it.

Always:
- Be precise and cite specific requirements
- Mention any deadlines or time-sensitive information
- Note if information may vary by country or circumstance
- Recommend consulting official sources or legal professionals for complex cases

Context:
{context}

Question: {question}

Answer: """
    
    def __init__(self, vector_store_manager: VectorStoreManager):
        """
        Initialize RAG service.
        
        Args:
            vector_store_manager: Vector store manager instance
        """
        self.vector_store_manager = vector_store_manager
        self.llm = self._initialize_llm()
        self.prompt = PromptTemplate(
            template=self.PROMPT_TEMPLATE,
            input_variables=["context", "question"]
        )
    
    def _initialize_llm(self):
        """
        Initialize the Ollama language model.
        
        Returns:
            OllamaLLM instance
        """
        logger.info(f"Initializing Ollama LLM: {settings.ollama_model} at {settings.ollama_base_url}")
        return OllamaLLM(
            model=settings.ollama_model,
            base_url=settings.ollama_base_url,
            temperature=settings.temperature,
        )
    
    def query(
        self,
        question: str,
        return_sources: bool = True
    ) -> Tuple[str, List[SourceDocument]]:
        """
        Query the RAG system with a question.
        
        Args:
            question: User's question
            return_sources: Whether to return source documents
            
        Returns:
            Tuple of (answer, source_documents)
        """
        logger.info(f"Processing query: {question[:100]}...")
        
        # Retrieve relevant documents
        retrieved_docs = self.vector_store_manager.similarity_search_with_score(
            question,
            k=settings.top_k_results
        )
        
        if not retrieved_docs:
            logger.warning("No relevant documents found for query")
            return (
                "I don't have enough information in my current knowledge base to answer this question. "
                "Please consult official immigration sources or contact an immigration attorney for assistance.",
                []
            )
        
        # Prepare context from retrieved documents
        context = self._format_context(retrieved_docs)
        
        # Generate answer
        try:
            prompt_text = self.prompt.format(context=context, question=question)
            response = self.llm.invoke(prompt_text)
            
            # Extract answer string from response
            if hasattr(response, 'content'):
                answer = str(response.content)
            else:
                answer = str(response)
            
            logger.info("Successfully generated answer")
            
            # Format source documents
            sources = []
            if return_sources:
                sources = self._format_sources(retrieved_docs)
            
            return answer, sources
            
        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            raise
    
    def _format_context(self, retrieved_docs: List[Tuple[Document, float]]) -> str:
        """
        Format retrieved documents into context string.
        
        Args:
            retrieved_docs: List of (document, score) tuples
            
        Returns:
            Formatted context string
        """
        context_parts = []
        for i, (doc, score) in enumerate(retrieved_docs, 1):
            source = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", "N/A")
            context_parts.append(
                f"[Source {i} - {source}, Page {page}]:\n{doc.page_content}\n"
            )
        
        return "\n---\n".join(context_parts)
    
    def _format_sources(
        self,
        retrieved_docs: List[Tuple[Document, float]]
    ) -> List[SourceDocument]:
        """
        Format retrieved documents as SourceDocument models.
        
        Args:
            retrieved_docs: List of (document, score) tuples
            
        Returns:
            List of SourceDocument models
        """
        sources = []
        for doc, score in retrieved_docs:
            source_doc = SourceDocument(
                content=doc.page_content[:500] + "..." if len(doc.page_content) > 500 else doc.page_content,
                source=doc.metadata.get("source", "Unknown"),
                page=doc.metadata.get("page"),
                score=float(score) if score else None
            )
            sources.append(source_doc)
        
        return sources
    
    def is_ready(self) -> bool:
        """
        Check if RAG service is ready to handle queries.
        
        Returns:
            True if vector store has documents
        """
        return self.vector_store_manager.get_document_count() > 0
