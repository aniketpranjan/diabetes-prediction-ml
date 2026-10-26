"""
seed_database.py
================
Pre-populates the SQLite database (data/diabetes_history.db) with initial realistic
clinical patient assessments across all risk tiers (Low, Moderate, High, Critical).
"""

import database as db

SAMPLE_PATIENTS = [
    {
        "patient_name": "Eleanor Vance",
        "gender": "Female",
        "age": 28.0,
        "hypertension": 0,
        "heart_disease": 0,
        "smoking_history": "never",
        "bmi": 21.4,
        "hba1c_level": 5.0,
        "blood_glucose_level": 86.0,
        "prediction": 0,
        "probability": 0.042,
        "percentage": 4.2,
        "risk_tier": "Low Risk"
    },
    {
        "patient_name": "Marcus Aurelius Reed",
        "gender": "Male",
        "age": 35.0,
        "hypertension": 0,
        "heart_disease": 0,
        "smoking_history": "never",
        "bmi": 24.1,
        "hba1c_level": 5.3,
        "blood_glucose_level": 92.0,
        "prediction": 0,
        "probability": 0.081,
        "percentage": 8.1,
        "risk_tier": "Low Risk"
    },
    {
        "patient_name": "Amira Al-Hassan",
        "gender": "Female",
        "age": 49.0,
        "hypertension": 0,
        "heart_disease": 0,
        "smoking_history": "former",
        "bmi": 27.8,
        "hba1c_level": 6.0,
        "blood_glucose_level": 115.0,
        "prediction": 0,
        "probability": 0.284,
        "percentage": 28.4,
        "risk_tier": "Moderate Risk"
    },
    {
        "patient_name": "David K. Henderson",
        "gender": "Male",
        "age": 52.0,
        "hypertension": 1,
        "heart_disease": 0,
        "smoking_history": "former",
        "bmi": 29.5,
        "hba1c_level": 6.2,
        "blood_glucose_level": 122.0,
        "prediction": 0,
        "probability": 0.395,
        "percentage": 39.5,
        "risk_tier": "Moderate Risk"
    },
    {
        "patient_name": "Carlos Gomez",
        "gender": "Male",
        "age": 58.0,
        "hypertension": 1,
        "heart_disease": 0,
        "smoking_history": "current",
        "bmi": 33.6,
        "hba1c_level": 7.1,
        "blood_glucose_level": 165.0,
        "prediction": 1,
        "probability": 0.628,
        "percentage": 62.8,
        "risk_tier": "High Risk"
    },
    {
        "patient_name": "Patricia M. Clark",
        "gender": "Female",
        "age": 63.0,
        "hypertension": 1,
        "heart_disease": 1,
        "smoking_history": "never",
        "bmi": 32.1,
        "hba1c_level": 6.9,
        "blood_glucose_level": 158.0,
        "prediction": 1,
        "probability": 0.587,
        "percentage": 58.7,
        "risk_tier": "High Risk"
    },
    {
        "patient_name": "Robert J. Sterling",
        "gender": "Male",
        "age": 67.0,
        "hypertension": 1,
        "heart_disease": 1,
        "smoking_history": "former",
        "bmi": 37.4,
        "hba1c_level": 8.6,
        "blood_glucose_level": 224.0,
        "prediction": 1,
        "probability": 0.892,
        "percentage": 89.2,
        "risk_tier": "Critical Risk"
    },
    {
        "patient_name": "Beverly Zhang",
        "gender": "Female",
        "age": 71.0,
        "hypertension": 1,
        "heart_disease": 0,
        "smoking_history": "current",
        "bmi": 35.8,
        "hba1c_level": 8.1,
        "blood_glucose_level": 205.0,
        "prediction": 1,
        "probability": 0.835,
        "percentage": 83.5,
        "risk_tier": "Critical Risk"
    }
]


def seed():
    db.init_db()
    existing = db.get_predictions(limit=1)
    if existing:
        print(f"[Seed] Database already contains records ({len(existing)} found). Skipping.")
        return

    print("[Seed] Inserting sample clinical patient assessments into SQLite...")
    for p in SAMPLE_PATIENTS:
        record_id = db.save_prediction(
            patient_name=p["patient_name"],
            gender=p["gender"],
            age=p["age"],
            hypertension=p["hypertension"],
            heart_disease=p["heart_disease"],
            smoking_history=p["smoking_history"],
            bmi=p["bmi"],
            hba1c_level=p["hba1c_level"],
            blood_glucose_level=p["blood_glucose_level"],
            prediction=p["prediction"],
            probability=p["probability"],
            percentage=p["percentage"],
            risk_tier=p["risk_tier"]
        )
        print(f"  -> Added Record #{record_id}: {p['patient_name']} ({p['risk_tier']} - {p['percentage']}%)")

    stats = db.get_database_stats()
    print(f"\n[Seed Complete] Total records in SQLite: {stats['total_screenings']}")
    print(f"Risk Tier Distribution: {stats['risk_tier_distribution']}")


if __name__ == "__main__":
    seed()
