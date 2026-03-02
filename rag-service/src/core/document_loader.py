"""
Document loader for processing various file formats.
Supports TXT and Markdown files (simplified version).
"""
from pathlib import Path
from typing import List
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
try:
    from langchain_core.documents import Document
except ImportError:
    from langchain.schema import Document
from loguru import logger
from src.config import settings


class DocumentLoader:
    """Handles loading and processing of various document formats (simplified)."""
    
    def __init__(self):
        """Initialize document loader with text splitter."""
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
    
    def load_document(self, file_path: str) -> List[Document]:
        """
        Load a single document from file path.
        
        Args:
            file_path: Path to the document file
            
        Returns:
            List of Document objects
            
        Raises:
            ValueError: If file format is not supported
        """
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        extension = path.suffix.lower()
        logger.info(f"Loading document: {path.name} (type: {extension})")
        
        try:
            if extension in [".txt", ".md"]:
                # Read text file directly
                with open(path, 'r', encoding='utf-8') as f:
                    text = f.read()
                
                document = Document(
                    page_content=text,
                    metadata={"source": str(path.name), "type": extension}
                )
                logger.info(f"Loaded document {path.name} with {len(text)} characters")
                return [document]
            else:
                raise ValueError(f"Unsupported file format: {extension}. Supported: .txt, .md")
            
        except Exception as e:
            logger.error(f"Error loading document {path.name}: {str(e)}")
            raise
    
    def load_directory(self, directory_path: str) -> List[Document]:
        """
        Load all supported documents from a directory.
        
        Args:
            directory_path: Path to directory containing documents
            
        Returns:
            List of all loaded Document objects
        """
        directory = Path(directory_path)
        
        if not directory.exists() or not directory.is_dir():
            raise NotADirectoryError(f"Invalid directory: {directory_path}")
        
        all_documents = []
        supported_extensions = [".txt", ".md"]
        
        for ext in supported_extensions:
            for file_path in directory.glob(f"**/*{ext}"):
                try:
                    documents = self.load_document(str(file_path))
                    all_documents.extend(documents)
                except Exception as e:
                    logger.warning(f"Skipping file {file_path.name}: {str(e)}")
                    continue
        
        logger.info(f"Loaded {len(all_documents)} total documents from {directory_path}")
        return all_documents
    
    def split_documents(self, documents: List[Document]) -> List[Document]:
        """
        Split documents into smaller chunks for better retrieval.
        
        Args:
            documents: List of documents to split
            
        Returns:
            List of chunked documents
        """
        logger.info(f"Splitting {len(documents)} documents into chunks")
        chunks = self.text_splitter.split_documents(documents)
        logger.info(f"Created {len(chunks)} chunks from documents")
        return chunks
    
    def process_documents(self, file_or_directory: str) -> List[Document]:
        """
        Complete document processing pipeline: load and split.
        
        Args:
            file_or_directory: Path to file or directory
            
        Returns:
            List of processed document chunks
        """
        path = Path(file_or_directory)
        
        if path.is_file():
            documents = self.load_document(str(path))
        elif path.is_dir():
            documents = self.load_directory(str(path))
        else:
            raise ValueError(f"Invalid path: {file_or_directory}")
        
        return self.split_documents(documents)
