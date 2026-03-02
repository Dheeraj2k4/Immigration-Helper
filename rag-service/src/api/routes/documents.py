"""
Document management API endpoints.
"""
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from loguru import logger
from src.models import DocumentUploadResponse, DocumentListResponse, DocumentInfo
from src.services import DocumentService
from src.api.dependencies import get_document_service

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    document_service: DocumentService = Depends(get_document_service)
) -> DocumentUploadResponse:
    """
    Upload a new document to the knowledge base.
    
    Supported formats: PDF, DOCX, TXT, MD
    
    The document will be processed and added to the vector store automatically.
    """
    try:
        response = await document_service.upload_document(file)
        return response
    except Exception as e:
        logger.error(f"Error in upload endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred uploading the document: {str(e)}"
        )


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    document_service: DocumentService = Depends(get_document_service)
) -> DocumentListResponse:
    """
    Get a list of all documents in the knowledge base.
    """
    try:
        documents = document_service.get_documents()
        return DocumentListResponse(
            documents=documents,
            total_count=len(documents)
        )
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred retrieving documents"
        )


@router.post("/reingest")
async def reingest_documents(
    document_service: DocumentService = Depends(get_document_service)
):
    """
    Reingest all documents from the documents directory.
    
    Useful for rebuilding the vector store or applying configuration changes.
    This will clear the existing vector store and reprocess all documents.
    """
    try:
        num_chunks = document_service.reingest_all_documents()
        return {
            "success": True,
            "message": f"Successfully reingested documents",
            "chunks_created": num_chunks
        }
    except Exception as e:
        logger.error(f"Error reingesting documents: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during reingestion: {str(e)}"
        )


@router.get("/health")
async def documents_health():
    """Check if document service is operational."""
    return {"status": "operational", "service": "documents"}
