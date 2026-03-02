"""
Vector store manager for document embeddings and retrieval.
Supports ChromaDB and FAISS vector stores.
"""
from typing import List, Optional, Union
from pathlib import Path
try:
    from langchain_core.documents import Document
except ImportError:
    from langchain.schema import Document
try:
    from langchain_ollama import OllamaEmbeddings
except ImportError:
    from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from langchain_community.vectorstores.faiss import FAISS
try:
    from langchain_core.vectorstores import VectorStore
except ImportError:
    from langchain.vectorstores.base import VectorStore
try:
    from langchain_core.embeddings import Embeddings
except ImportError:
    from langchain.embeddings.base import Embeddings
from loguru import logger
from src.config import settings
from src.utils import ensure_directory


class VectorStoreManager:
    """Manages vector store operations for document embeddings."""
    
    def __init__(self):
        """Initialize vector store manager with embeddings."""
        self.embeddings = self._initialize_embeddings()
        self.vector_store: Optional[VectorStore] = None
        self._load_or_create_vector_store()
    
    def _initialize_embeddings(self) -> Embeddings:
        """
        Initialize Ollama embedding model (uses local Mistral for embeddings).
        
        Returns:
            Embeddings instance
        """
        logger.info(f"Initializing Ollama embeddings with model: {settings.ollama_model}")
        return OllamaEmbeddings(
            model=settings.ollama_model,
            base_url=settings.ollama_base_url
        )
    
    def _load_or_create_vector_store(self):
        """Load existing vector store or create new one."""
        try:
            if settings.vector_store_type == "chroma":
                self._load_or_create_chroma()
            elif settings.vector_store_type == "faiss":
                self._load_or_create_faiss()
            else:
                raise ValueError(f"Unsupported vector store type: {settings.vector_store_type}")
        except Exception as e:
            logger.warning(f"Could not load existing vector store: {str(e)}")
            logger.info("Vector store will be created when documents are added")
    
    def _load_or_create_chroma(self):
        """Load or create ChromaDB vector store."""
        persist_dir = ensure_directory(settings.chroma_persist_directory)
        
        try:
            self.vector_store = Chroma(
                collection_name=settings.collection_name,
                embedding_function=self.embeddings,
                persist_directory=str(persist_dir),
            )
            logger.info(f"Loaded existing ChromaDB from {persist_dir}")
        except Exception as e:
            logger.info(f"Creating new ChromaDB: {str(e)}")
            self.vector_store = None
    
    def _load_or_create_faiss(self):
        """Load or create FAISS vector store."""
        index_path = Path(settings.chroma_persist_directory) / "faiss_index"
        
        if index_path.exists():
            try:
                self.vector_store = FAISS.load_local(
                    str(index_path),
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                logger.info(f"Loaded existing FAISS index from {index_path}")
            except Exception as e:
                logger.warning(f"Could not load FAISS index: {str(e)}")
                self.vector_store = None
        else:
            logger.info("No existing FAISS index found")
            self.vector_store = None
    
    def add_documents(self, documents: List[Document]) -> int:
        """
        Add documents to vector store.
        
        Args:
            documents: List of Document objects to add
            
        Returns:
            Number of documents added
        """
        if not documents:
            logger.warning("No documents to add")
            return 0
        
        logger.info(f"Adding {len(documents)} documents to vector store")
        
        try:
            if self.vector_store is None:
                # Create new vector store
                if settings.vector_store_type == "chroma":
                    persist_dir = ensure_directory(settings.chroma_persist_directory)
                    self.vector_store = Chroma.from_documents(
                        documents=documents,
                        embedding=self.embeddings,
                        collection_name=settings.collection_name,
                        persist_directory=str(persist_dir),
                    )
                    logger.info("Created new ChromaDB vector store")
                else:  # FAISS
                    self.vector_store = FAISS.from_documents(
                        documents=documents,
                        embedding=self.embeddings,
                    )
                    logger.info("Created new FAISS vector store")
            else:
                # Add to existing vector store
                self.vector_store.add_documents(documents)
                logger.info(f"Added documents to existing vector store")
            
            # Persist changes
            self.persist()
            
            return len(documents)
            
        except Exception as e:
            logger.error(f"Error adding documents to vector store: {str(e)}")
            raise
    
    def similarity_search(
        self,
        query: str,
        k: Optional[int] = None
    ) -> List[Document]:
        """
        Perform similarity search in vector store.
        
        Args:
            query: Search query
            k: Number of results to return (default from settings)
            
        Returns:
            List of relevant documents
        """
        if self.vector_store is None:
            logger.warning("Vector store not initialized")
            return []
        
        k = k or settings.top_k_results
        
        try:
            logger.debug(f"Performing similarity search for query: {query[:50]}...")
            results = self.vector_store.similarity_search(query, k=k)
            logger.info(f"Found {len(results)} relevant documents")
            return results
        except Exception as e:
            logger.error(f"Error during similarity search: {str(e)}")
            return []
    
    def similarity_search_with_score(
        self,
        query: str,
        k: Optional[int] = None
    ) -> List[tuple[Document, float]]:
        """
        Perform similarity search with relevance scores.
        
        Args:
            query: Search query
            k: Number of results to return
            
        Returns:
            List of (document, score) tuples
        """
        if self.vector_store is None:
            logger.warning("Vector store not initialized")
            return []
        
        k = k or settings.top_k_results
        
        try:
            results = self.vector_store.similarity_search_with_score(query, k=k)
            logger.info(f"Found {len(results)} relevant documents with scores")
            return results
        except Exception as e:
            logger.error(f"Error during similarity search: {str(e)}")
            return []
    
    def persist(self):
        """Persist vector store to disk."""
        if self.vector_store is None:
            return
        
        try:
            if settings.vector_store_type == "chroma":
                # ChromaDB auto-persists with persist_directory
                pass
            elif settings.vector_store_type == "faiss" and isinstance(self.vector_store, FAISS):
                index_path = Path(settings.chroma_persist_directory) / "faiss_index"
                ensure_directory(str(index_path.parent))
                self.vector_store.save_local(str(index_path))
                logger.info(f"Persisted FAISS index to {index_path}")
        except Exception as e:
            logger.error(f"Error persisting vector store: {str(e)}")
    
    def get_document_count(self) -> int:
        """
        Get the number of documents in vector store.
        
        Returns:
            Document count
        """
        if self.vector_store is None:
            return 0
        
        try:
            if settings.vector_store_type == "chroma" and isinstance(self.vector_store, Chroma):
                return self.vector_store._collection.count()  # type: ignore
            elif isinstance(self.vector_store, FAISS):
                return self.vector_store.index.ntotal  # type: ignore
        except Exception:
            return 0
        return 0
    
    def clear(self):
        """Clear all documents from vector store."""
        logger.warning("Clearing vector store")
        self.vector_store = None
        # Optionally delete persisted files here
