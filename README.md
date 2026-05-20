# Immigration Helper

A full-stack web application for visa and immigration assistance. Provides an AI-powered visa Q&A chatbot, real-time immigration news, interactive visa document checklists, and multi-language support.

## Features

- **Visa Guide Chatbot** — Ask questions about visa types and requirements; powered by a Python RAG service with pre-loaded guides for H1B, F1, UK, Canada, Australia, and passport applications
- **Immigration News** — Live immigration news feed with filtering by country and category
- **Visa Checklist** — Interactive document checklists for tourist, student, and work visas
- **Multi-language UI** — English, Spanish, Hindi, and Telugu

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, i18next |
| Backend | Node.js, Express, TypeScript |
| RAG Service | Python, FastAPI, LangChain, ChromaDB |
| LLM | Groq (free) / Ollama (free) / OpenAI |

## Project Structure

```
Immigration-Helper/
├── .env                        # Unified config for all services
├── client/                     # React frontend (port 5173)
│   └── src/
│       ├── pages/              # Home, VisaGuide, Updates, Checklist
│       ├── components/         # Navbar, Footer, UI primitives
│       ├── hooks/              # useNews (news feed hook)
│       └── i18n/               # Translations (en, es, hi, te)
├── server/                     # Node.js/Express backend (port 5000)
│   └── src/
│       ├── routes/             # visaChatRoutes, newsRoutes
│       └── services/           # newsService, geminiService
├── rag-service/                # Python RAG chatbot (port 8000)
│   ├── src/                    # FastAPI app, LangChain pipeline
│   └── data/documents/         # Visa guide markdown files
└── database/                   # SQL schema
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Configure environment

```powershell
cp .env.example .env
```

Open `.env` and set at minimum:

```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_key_here
EMBEDDING_PROVIDER=huggingface
```

### 2. Start the RAG service

```powershell
cd rag-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m src.scripts.ingest_documents   # run once to build the vector store
uvicorn src.main:app --reload
```

### 3. Start the backend

```powershell
cd server
npm install
npm run dev
```

### 4. Start the frontend

```powershell
cd client
npm install
npm run dev
```

### 5. Open the app

http://localhost:5173

## API Endpoints

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| RAG API | http://localhost:8000 |
| RAG Docs | http://localhost:8000/docs |

**Visa chatbot query:**
```bash
POST http://localhost:5000/api/visa-chat/query
Content-Type: application/json

{ "query": "What documents do I need for an H1B visa?" }
```

## Adding Visa Guides

1. Add a `.md`, `.txt`, `.pdf`, or `.docx` file to `rag-service/data/documents/`
2. Re-run ingestion: `python -m src.scripts.ingest_documents`
3. Restart the RAG service

## Supported LLM Providers

| Provider | Cost | Notes |
|----------|------|-------|
| **Groq** | Free | Recommended — fast inference |
| **Ollama** | Free | Requires local model download |
| **OpenAI** | Paid | Set `LLM_PROVIDER=openai` |

## Common Issues

| Issue | Fix |
|-------|-----|
| "Vector store not initialized" | Run `python -m src.scripts.ingest_documents` |
| "RAG service unavailable" | Ensure port 8000 is free and venv is activated |
| Python import errors | Re-activate venv and run `pip install -r requirements.txt` |
| News feed not loading | Check `NEWSDATA_API_KEY` is set in `.env` |

## License

MIT
