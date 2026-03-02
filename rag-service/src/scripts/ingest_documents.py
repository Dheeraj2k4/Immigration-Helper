"""
Script to ingest documents into the vector store.
Run this after adding new documents to the data/documents directory.
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from loguru import logger
from src.core import DocumentLoader, VectorStoreManager
from src.utils import get_documents_directory, setup_logging


def main():
    """Main ingestion function."""
    setup_logging()
    logger.info("Starting document ingestion process")
    
    # Initialize components
    document_loader = DocumentLoader()
    vector_store_manager = VectorStoreManager()
    
    # Get documents directory
    docs_dir = get_documents_directory()
    logger.info(f"Looking for documents in: {docs_dir}")
    
    # Check if directory has files
    files = list(docs_dir.glob("*"))
    if not files:
        logger.warning(f"No files found in {docs_dir}")
        logger.info("Please add PDF, DOCX, TXT, or MD files to the documents directory")
        return
    
    try:
        # Process documents
        logger.info("Processing documents...")
        chunks = document_loader.process_documents(str(docs_dir))
        
        if not chunks:
            logger.warning("No document chunks created")
            return
        
        # Add to vector store
        logger.info("Adding documents to vector store...")
        num_added = vector_store_manager.add_documents(chunks)
        
        logger.success(f"✓ Successfully ingested {num_added} document chunks")
        logger.info("Vector store is ready for queries!")
        
    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}")
        raise


if __name__ == "__main__":
    main()
