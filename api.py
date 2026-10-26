"""
api.py
======
FastAPI REST Backend for the Diabetes Prediction ML System.
Exposes real-time inference endpoints and SQLite persistence for the React frontend.

Usage:
    python api.py
    or:
    uvicorn api:app --reload --port 8000
"""

from pathlib import Path
from typing import Optional
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure custom pipeline transformer functions are in scope for joblib unpickling
from train_model import convert_zeros_to_nan
import __main__
__main__.convert_zeros_to_nan = convert_zeros_to_nan

# SQLite Database Module
import database as db

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "diabetes_pipeline.pkl"

app = FastAPI(
    title="Diabetes Prediction ML API with SQLite",
    description="REST API serving Scikit-Learn predictions with SQLite persistence for clinical records.",
    version="1.1.0"
)

# Enable CORS for the React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained pipeline
pipeline = None
if MODEL_PATH.exists():
    try:
        pipeline = joblib.load(MODEL_PATH)
        print(f"[API] Loaded trained model pipeline from {MODEL_PATH}")
    except Exception as e:
        print(f"[API ERROR] Failed to load model pipeline: {e}")
else:
    print(f"[API WARNING] Model file not found at {MODEL_PATH}. Run python train_model.py first.")


class PatientPayload(BaseModel):
    patient_name: Optional[str] = Field("Anonymous Patient", example="Jane Doe")
    gender: str = Field(..., example="Female")
    age: float = Field(..., ge=1, le=120, example=45.0)
    hypertension: int = Field(..., ge=0, le=1, example=0)
    heart_disease: int = Field(..., ge=0, le=1, example=0)
    smoking_history: str = Field(..., example="never")
    bmi: float = Field(..., ge=10.0, le=70.0, example=28.5)
    HbA1c_level: float = Field(..., ge=3.0, le=15.0, example=6.2)
    blood_glucose_level: float = Field(..., ge=40.0, le=400.0, example=120.0)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "database_file": str(db.DB_PATH),
        "model_loaded": pipeline is not None,
        "model_path": str(MODEL_PATH)
    }


@app.post("/predict")
def predict_diabetes(patient: PatientPayload):
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model pipeline is not loaded on the server.")

    # Convert payload into DataFrame with the exact column order expected by the pipeline
    input_df = pd.DataFrame([{
        "gender": patient.gender,
        "age": patient.age,
        "hypertension": patient.hypertension,
        "heart_disease": patient.heart_disease,
        "smoking_history": patient.smoking_history,
        "bmi": patient.bmi,
        "HbA1c_level": patient.HbA1c_level,
        "blood_glucose_level": patient.blood_glucose_level,
    }])

    try:
        prediction = int(pipeline.predict(input_df)[0])
        probability = float(pipeline.predict_proba(input_df)[0][1])
        percentage = round(probability * 100, 1)

        # Classify risk tier
        if percentage >= 70:
            risk_tier = "Critical Risk"
        elif percentage >= 45:
            risk_tier = "High Risk"
        elif percentage >= 20:
            risk_tier = "Moderate Risk"
        else:
            risk_tier = "Low Risk"

        # Save to SQLite database
        record_id = db.save_prediction(
            patient_name=patient.patient_name,
            gender=patient.gender,
            age=patient.age,
            hypertension=patient.hypertension,
            heart_disease=patient.heart_disease,
            smoking_history=patient.smoking_history,
            bmi=patient.bmi,
            hba1c_level=patient.HbA1c_level,
            blood_glucose_level=patient.blood_glucose_level,
            prediction=prediction,
            probability=round(probability, 4),
            percentage=percentage,
            risk_tier=risk_tier
        )

        return {
            "record_id": record_id,
            "prediction": prediction,
            "probability": round(probability, 4),
            "percentage": percentage,
            "risk_tier": risk_tier,
            "saved_to_database": True,
            "disclaimer": "Academic prototype only; not certified for clinical diagnosis."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.get("/predictions")
def list_predictions(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    """Fetch stored prediction records from the SQLite database."""
    records = db.get_predictions(limit=limit, offset=offset)
    return {
        "count": len(records),
        "limit": limit,
        "offset": offset,
        "records": records
    }


@app.delete("/predictions/{prediction_id}")
def remove_prediction(prediction_id: int):
    """Delete a prediction record from the SQLite database."""
    deleted = db.delete_prediction(prediction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Prediction record not found.")
    return {"status": "success", "deleted_id": prediction_id}


@app.get("/analytics")
def get_analytics():
    """Retrieve aggregate database analytics from SQLite."""
    return db.get_database_stats()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
