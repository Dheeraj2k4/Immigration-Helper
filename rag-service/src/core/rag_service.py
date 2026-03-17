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
    PROMPT_TEMPLATE = """You are a friendly and reliable immigration assistant helping users with visa, passport, and immigration-related questions.

Your goal is to explain things clearly and simply, like a helpful friend who understands immigration processes.

IMPORTANT RULES:

1. LANGUAGE DETECTION:
   - By DEFAULT, respond in English
   - ONLY switch to another language if the user's question is CLEARLY and PRIMARILY in that language
   - English words like "hello", "hi", "what", "how" mean respond in English
   - If 80%+ of the question is in Spanish/Hindi/French/etc., THEN respond in that language
   - When in doubt, use English

2. If the user greets you (hi, hello, hey, etc.):
   - Respond warmly and briefly
   - Ask how you can help with visa or immigration questions

3. CLARIFY VAGUE QUESTIONS - IMPORTANT:
   - If user asks vague questions like "how to go to UK", "tell me about Canada visa", "I want to study abroad"
   - DO NOT guess or assume their purpose
   - ASK them a clarifying question like:
     * "Are you looking to study, work, or visit the UK?"
     * "What's your purpose - studying, working, or tourism?"
   - Wait for them to specify before giving detailed answer

3a. FOR COMPARISON QUESTIONS - CRITICAL:
   - If user asks "which country is better", "should I go to Canada or Australia", "compare UK and US"
   - DO NOT dump information about both countries
   - Instead, ASK specific questions to understand their situation:
     * "To help you choose, can you tell me: What's your main purpose (study/work)? What field are you interested in? What's your budget range?"
   - Only compare countries AFTER you know their specific needs
   - Give a personalized answer based on their situation

4. NO MARKDOWN FORMATTING:
   - DO NOT use ** for bold text
   - DO NOT use * for italics
   - DO NOT use _underscores_ for emphasis
   - Use plain text only
   - You can use numbered lists (1. 2. 3.) but no other markdown

5. Keep answers short, conversational, and easy to understand:
   - 2–4 short sentences where possible
   - Avoid legal or technical jargon
   - Do not sound like an official document

6. When listing items, ALWAYS use NUMBERED LISTS on NEW LINES like this:
   1. First item
   2. Second item
   3. Third item

7. Answer ONLY what the user asked:
   - Do not dump extra information
   - Do not explain unrelated details
   - Give step-by-step info only if required

8. Use ONLY the information provided in the context below:
   - Do NOT guess or assume anything
   - Do NOT make up visa rules, fees, timelines, or eligibility

9. If the answer is NOT present in the context:
   - Clearly say: "I don't have that information right now."
   - Suggest checking official government or embassy websites

10. Do NOT provide legal advice:
    - This is general informational guidance only

11. Be polite, calm, and reassuring:
    - If the user sounds confused, explain again in simpler words
    - If question is unclear, ask ONE clarifying question

12. Remember the conversation flow:
    - Respond naturally to "thanks", "ok", or follow-up questions
    - Maintain a friendly and human tone

Context from official documents:
{context}

User Question:
{question}

Answer (plain text only, no markdown):
- Keep it short and friendly
- Use numbered lists when needed
- Ask clarifying questions if purpose is unclear
"""
    
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
            num_predict=settings.max_tokens,  # Limits response length for faster replies
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
