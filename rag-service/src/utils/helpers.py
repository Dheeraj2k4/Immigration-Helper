"""
Utility functions and helpers.
"""
import os
from pathlib import Path
from typing import List
from loguru import logger


def ensure_directory(path: str) -> Path:
    """
    Ensure a directory exists, create if it doesn't.
    
    Args:
        path: Directory path to ensure
        
    Returns:
        Path object of the directory
    """
    directory = Path(path)
    directory.mkdir(parents=True, exist_ok=True)
    logger.debug(f"Ensured directory exists: {directory}")
    return directory


def get_project_root() -> Path:
    """
    Get the project root directory.
    
    Returns:
        Path object of project root
    """
    return Path(__file__).parent.parent.parent


def get_documents_directory() -> Path:
    """
    Get the documents directory path.
    
    Returns:
        Path object of documents directory
    """
    docs_dir = get_project_root() / "data" / "documents"
    ensure_directory(str(docs_dir))
    return docs_dir


def get_supported_extensions() -> List[str]:
    """
    Get list of supported document file extensions.
    
    Returns:
        List of file extensions
    """
    return [".pdf", ".docx", ".txt", ".md"]


def is_supported_file(filename: str) -> bool:
    """
    Check if a file is supported based on extension.
    
    Args:
        filename: Name of the file to check
        
    Returns:
        True if file extension is supported
    """
    ext = Path(filename).suffix.lower()
    return ext in get_supported_extensions()


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal attacks.
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove path components and keep only the filename
    filename = os.path.basename(filename)
    # Remove any remaining potentially dangerous characters
    return "".join(c for c in filename if c.isalnum() or c in "._- ")


def format_sources_for_prompt(sources: List[str]) -> str:
    """
    Format retrieved sources for inclusion in LLM prompt.
    
    Args:
        sources: List of source text chunks
        
    Returns:
        Formatted string of sources
    """
    formatted = "\n\n---\n\n".join(
        f"Source {i+1}:\n{source}" for i, source in enumerate(sources)
    )
    return formatted
