"""
Document management service.
Handles document upload, processing, and management operations.
"""
from pathlib import Path
from typing import List
from fastapi import UploadFile
from loguru import logger
from src.core import DocumentLoader, VectorStoreManager
from src.utils import get_documents_directory, is_supported_file, sanitize_filename
from src.models import DocumentUploadResponse, DocumentInfo


class DocumentService:
    """Service for managing documents and vector store."""
    
    def __init__(
        self,
        document_loader: DocumentLoader,
        vector_store_manager: VectorStoreManager
    ):
        """
        Initialize document service.
        
        Args:
            document_loader: DocumentLoader instance
            vector_store_manager: VectorStoreManager instance
        """
        self.document_loader = document_loader
        self.vector_store_manager = vector_store_manager
        self.documents_dir = get_documents_directory()
    
    async def upload_document(self, file: UploadFile) -> DocumentUploadResponse:
        """
        Upload and process a new document.
        
        Args:
            file: Uploaded file
            
        Returns:
            DocumentUploadResponse with upload status
        """
        if not file.filename:
            return DocumentUploadResponse(
                success=False,
                message="No filename provided",
                filename="unknown",
                chunks_created=0
            )
        
        filename = sanitize_filename(file.filename)
        
        # Validate file type
        if not is_supported_file(filename):
            logger.warning(f"Unsupported file type: {filename}")
            return DocumentUploadResponse(
                success=False,
                message=f"Unsupported file type. Supported: PDF, DOCX, TXT, MD",
                filename=filename,
                chunks_created=0
            )
        
        # Save file
        file_path = self.documents_dir / filename
        try:
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            logger.info(f"Saved file: {filename}")
        except Exception as e:
            logger.error(f"Error saving file {filename}: {str(e)}")
            return DocumentUploadResponse(
                success=False,
                message=f"Error saving file: {str(e)}",
                filename=filename,
                chunks_created=0
            )
        
        # Process and add to vector store
        try:
            chunks = self.document_loader.process_documents(str(file_path))
            num_chunks = self.vector_store_manager.add_documents(chunks)
            
            logger.info(f"Successfully processed {filename} into {num_chunks} chunks")
            return DocumentUploadResponse(
                success=True,
                message="Document uploaded and processed successfully",
                filename=filename,
                chunks_created=num_chunks
            )
        except Exception as e:
            logger.error(f"Error processing document {filename}: {str(e)}")
            # Clean up file if processing failed
            file_path.unlink(missing_ok=True)
            return DocumentUploadResponse(
                success=False,
                message=f"Error processing document: {str(e)}",
                filename=filename,
                chunks_created=0
            )
    
    def get_documents(self) -> List[DocumentInfo]:
        """
        Get list of all documents in the system.
        
        Returns:
            List of DocumentInfo objects
        """
        documents = []
        
        for file_path in self.documents_dir.iterdir():
            if file_path.is_file() and is_supported_file(file_path.name):
                try:
                    stat = file_path.stat()
                    documents.append(
                        DocumentInfo(
                            filename=file_path.name,
                            chunk_count=0,  # Could be enhanced to track this
                            uploaded_at=stat.st_mtime
                        )
                    )
                except Exception as e:
                    logger.warning(f"Error getting info for {file_path.name}: {e}")
        
        return documents
    
    def reingest_all_documents(self) -> int:
        """
        Reingest all documents from the documents directory.
        Useful for updating vector store after configuration changes.
        
        Returns:
            Number of document chunks added
        """
        logger.info("Starting bulk document reingestion")
        
        try:
            # Clear existing vector store
            self.vector_store_manager.clear()
            
            # Process all documents
            chunks = self.document_loader.process_documents(str(self.documents_dir))
            
            # Add to vector store
            num_chunks = self.vector_store_manager.add_documents(chunks)
            
            logger.info(f"Reingested {num_chunks} chunks from documents directory")
            return num_chunks
            
        except Exception as e:
            logger.error(f"Error during bulk reingestion: {str(e)}")
            raise
