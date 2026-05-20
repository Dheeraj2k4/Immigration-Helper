"""
Configuration management for RAG service.
Uses pydantic BaseSettings for type-safe configuration from environment variables.
"""
from typing import Literal
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Get the absolute path to the .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    api_env: Literal["development", "production", "testing"] = Field(
        default="development", alias="API_ENV"
    )
    
    # LLM Configuration
    llm_provider: Literal["ollama", "groq"] = Field(default="ollama", alias="LLM_PROVIDER")

    # Ollama Configuration (runs locally with GPU support)
    ollama_base_url: str = Field(default="http://localhost:11434", alias="OLLAMA_BASE_URL")
    ollama_model: str = Field(default="mistral-gpu", alias="OLLAMA_MODEL")

    # Groq Configuration (cloud, ~1-3s responses, free tier)
    groq_api_key: str = Field(default="", alias="GROQ_API_KEY")
    groq_model: str = Field(default="llama-3.1-8b-instant", alias="GROQ_MODEL")
    
    # Embedding Configuration (HuggingFace only)
    huggingface_embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2", alias="HUGGINGFACE_EMBEDDING_MODEL"
    )
    
    # Vector Store Configuration
    vector_store_type: Literal["chroma", "faiss"] = Field(
        default="faiss", alias="VECTOR_STORE_TYPE"
    )
    chroma_persist_directory: str = Field(
        default="./data/chroma_db", alias="CHROMA_PERSIST_DIRECTORY"
    )
    collection_name: str = Field(default="visa_documents", alias="COLLECTION_NAME")
    
    # RAG Configuration
    chunk_size: int = Field(default=1000, alias="CHUNK_SIZE")
    chunk_overlap: int = Field(default=200, alias="CHUNK_OVERLAP")
    top_k_results: int = Field(default=3, alias="TOP_K_RESULTS")  # Reduced for faster responses
    temperature: float = Field(default=0.5, alias="TEMPERATURE")  # Lower for faster, focused answers
    max_tokens: int = Field(default=500, alias="MAX_TOKENS")  # Reduced for shorter responses
    
    # CORS Configuration
    cors_origins: str = Field(
        default="http://localhost:5173,http://localhost:5000", alias="CORS_ORIGINS"
    )
    
    # Logging
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Convert comma-separated CORS origins to list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()
