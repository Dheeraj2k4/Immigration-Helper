# Immigration Helper

A full-stack web application for visa and immigration assistance with AI-powered RAG chatbot.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- ONE of: Groq API (FREE) / Ollama (FREE) / OpenAI (paid)

### 1. Configure (Single .env file)
```powershell
cp .env.example .env
# Edit .env - Add your API key(s)
```

**Recommended FREE setup:**
```env
LLM_PROVIDER=groq
GROQ_API_KEY=your_key_here          # Get from https://console.groq.com
EMBEDDING_PROVIDER=huggingface
```

### 2. Start Python RAG Service
```powershell
cd rag-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m src.scripts.ingest_documents
uvicorn src.main:app --reload
```

### 3. Start Node.js Backend
```powershell
cd server
npm install
npm run dev
```

### 4. Start React Frontend
```powershell
cd client
npm install
npm run dev
```

### 5. Open App
http://localhost:5173

## 📁 Structure

```
Immigration-Helper/
├── .env                   # SINGLE unified configuration (NEW)
├── client/                # React frontend
├── server/                # Node.js/Express backend  
├── rag-service/          # Python RAG chatbot (NEW)
│   └── data/documents/   # Visa guides (pre-loaded)
├── README.md             # This file
└── SETUP_RAG.md         # Detailed guide
```

## ⚙️ LLM Options

All configured in single `.env` file:

| Provider | Cost | Speed | Setup |
|----------|------|-------|-------|
| **Groq** ⭐ | FREE | Very Fast | Get key at console.groq.com |
| **Ollama** | FREE | Medium | Install + download model |
| **OpenAI** | ~$0.02/query | Fast | Get key at platform.openai.com |

## 🔗 Endpoints

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- RAG API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Chat with Bot
```bash
POST /api/visa-chat/query
{
  "query": "What documents do I need for H1B visa?"
}
```

## 🎯 Features

✅ AI-powered visa Q&A chatbot  
✅ Semantic search (understands meaning)  
✅ Source attribution  
✅ Multiple FREE LLM options  
✅ Pre-loaded visa guides (H1B, F1, Passport)  

## 📚 Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS  
**Backend:** Node.js, Express, TypeScript, MongoDB  
**RAG:** Python, FastAPI, LangChain, ChromaDB  
**LLMs:** Groq/Ollama/OpenAI  

## 🔧 Adding Documents

1. Add PDF/DOCX/TXT/MD to `rag-service/data/documents/`
2. Run: `python -m src.scripts.ingest_documents`  
3. Restart RAG service

## 📖 Documentation

**[SETUP_RAG.md](./SETUP_RAG.md)** - Complete setup and troubleshooting guide

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "Vector store not initialized" | Run document ingestion script |
| "RAG service unavailable" | Check port 8000 available |
| Python import errors | Activate venv + reinstall |

See [SETUP_RAG.md](./SETUP_RAG.md) for detailed troubleshooting.

## 📝 License

MIT
