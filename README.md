# Power BI Dashboard Analyzer & Copilot AI

Power BI Dashboard Analyzer is an intelligent, full-stack web application designed to automatically profile datasets and generate tailored analytics packages for Power BI. It leverages advanced AI agents to write DAX measures, recommend optimized dashboard layouts, and interactively answer questions about your data.

## 🚀 Features

- **Automated Data Profiling**: Instantly summarizes dataset structure, detects data types, and highlights key statistics.
- **AI DAX Generation**: Powered by LangGraph and Gemini, the Copilot automatically generates complex DAX measures (aggregations, time intelligence, KPIs) tailored to your schema.
- **Smart Visualizations**: Recommends chart types, layouts, and mappings using an integrated heuristic scoring engine.
- **Interactive Copilot Chat**: Chat with an AI assistant that remembers your dataset context via ChromaDB vector retrieval.
- **Professional UX/UI**: Styled with Tailwind CSS using the authentic Power BI Yellow aesthetic for a premium experience.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Plotly.js** (Live Chart Previews)

### Backend
- **FastAPI** (Python)
- **LangGraph & LangChain** (Agentic AI Workflow)
- **Google Gemini API** (LLM Provider)
- **ChromaDB** (Local Vector Database for RAG)
- **SQLAlchemy** (PostgreSQL/SQLite Integration)
- **JWT Authentication** (passlib, bcrypt, jose)
- **Pandas** (Data Processing)

## 🏗️ Architecture

The backend utilizes a multi-agent **LangGraph** architecture. When a dataset is uploaded:
1. The **Storytelling Engine** profiles the data.
2. The schema and metadata are chunked and embedded into **ChromaDB**.
3. When interacting with the Copilot, LangGraph retrieves the dataset context from ChromaDB and invokes the **Gemini** LLM to generate DAX logic or answer analytical questions.

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/nikhilerz/power-bi-analyzer.git
cd power-bi-analyzer
```

### 2. Setup the Backend
Navigate to the backend folder and set up a virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
```

Install the dependencies:
```bash
pip install -r requirements.txt
# Note: You will need chromadb, fastapi, uvicorn, langchain-google-genai, etc.
```

Create a `.env` file in the `backend/` directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The backend API will run at `http://localhost:8000`. Documentation available at `http://localhost:8000/docs`.

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The application will run at `http://localhost:5173`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
