from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.api.routes import auth, datasets, chat

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Power BI Copilot AI API - Production")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modular Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
# Keeping the legacy prefix so the frontend upload works without modifications
app.include_router(datasets.router, prefix="/api", tags=["legacy"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
