from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from app.core.db import get_db
from app.db.models import Dataset
from services.profiler import profile_dataset
from core.ai_engine import generate_recommendations
from app.core.scoring import generate_dashboard_score
from app.core.storytelling import generate_data_narrative
from app.core.chroma import store_dataset_context

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file type.")
        
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        profile_data, df = profile_dataset(file_path)
        recommendations = generate_recommendations(profile_data, df)
        
        # New Scoring & Storytelling
        score_data = generate_dashboard_score(profile_data)
        narrative = generate_data_narrative(profile_data, score_data)
        
        # Store in ChromaDB for LangGraph
        store_dataset_context(file_id, profile_data, narrative)
        
        # Save to PostgreSQL (SQLite)
        db_dataset = Dataset(
            id=file_id,
            filename=file.filename,
            storage_path=file_path,
            row_count=profile_data["overview"]["rows"],
            col_count=profile_data["overview"]["columns"]
        )
        db.add(db_dataset)
        db.commit()
        db.refresh(db_dataset)
        
        return {
            "dataset_id": db_dataset.id,
            "overview": profile_data["overview"],
            "columns": profile_data["columns"],
            "score": score_data,
            "narrative": narrative,
            "kpis": recommendations["kpis"],
            "charts": recommendations["charts"],
            "layout": recommendations["layout"],
            "filters": recommendations.get("filters", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
