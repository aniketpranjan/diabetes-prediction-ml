"""
database.py
===========
SQLite Database Module for the Diabetes Prediction System.
Uses Python's standard library `sqlite3` to persist patient prediction records,
clinical audit logs, and aggregate risk statistics.
"""

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Dict, List, Any, Optional

# Database path in the data directory
BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "data"
DB_PATH = DB_DIR / "diabetes_history.db"


@contextmanager
def get_db():
    """Context manager that automatically manages commits and closes connections."""
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Initializes the database schema if tables do not already exist."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_name TEXT DEFAULT 'Anonymous Patient',
                gender TEXT NOT NULL,
                age REAL NOT NULL,
                hypertension INTEGER NOT NULL,
                heart_disease INTEGER NOT NULL,
                smoking_history TEXT NOT NULL,
                bmi REAL NOT NULL,
                hba1c_level REAL NOT NULL,
                blood_glucose_level REAL NOT NULL,
                prediction INTEGER NOT NULL,
                probability REAL NOT NULL,
                percentage REAL NOT NULL,
                risk_tier TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_predictions_created_at
            ON predictions(created_at DESC)
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_predictions_risk_tier
            ON predictions(risk_tier)
        """)
    print(f"[Database] SQLite schema verified at {DB_PATH}")


def save_prediction(
    gender: str,
    age: float,
    hypertension: int,
    heart_disease: int,
    smoking_history: str,
    bmi: float,
    hba1c_level: float,
    blood_glucose_level: float,
    prediction: int,
    probability: float,
    percentage: float,
    risk_tier: str,
    patient_name: Optional[str] = None
) -> int:
    """Inserts a new prediction evaluation into the SQLite database."""
    name = patient_name if patient_name and patient_name.strip() else "Anonymous Patient"
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO predictions (
                patient_name, gender, age, hypertension, heart_disease,
                smoking_history, bmi, hba1c_level, blood_glucose_level,
                prediction, probability, percentage, risk_tier
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name, gender, age, hypertension, heart_disease,
            smoking_history, bmi, hba1c_level, blood_glucose_level,
            prediction, probability, percentage, risk_tier
        ))
        return cursor.lastrowid


def get_predictions(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Retrieves recent prediction records."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM predictions
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        """, (limit, offset))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]


def delete_prediction(prediction_id: int) -> bool:
    """Deletes a single prediction record by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
        return cursor.rowcount > 0


def get_database_stats() -> Dict[str, Any]:
    """Computes summary statistics across saved patient records."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) AS total FROM predictions")
        total = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT risk_tier, COUNT(*) AS count
            FROM predictions
            GROUP BY risk_tier
        """)
        tier_counts = {row["risk_tier"]: row["count"] for row in cursor.fetchall()}

        cursor.execute("""
            SELECT 
                AVG(bmi) AS avg_bmi,
                AVG(hba1c_level) AS avg_hba1c,
                AVG(blood_glucose_level) AS avg_glucose,
                AVG(percentage) AS avg_risk
            FROM predictions
        """)
        averages = cursor.fetchone()

        return {
            "total_screenings": total,
            "risk_tier_distribution": tier_counts,
            "averages": {
                "bmi": round(averages["avg_bmi"] or 0, 1),
                "hba1c": round(averages["avg_hba1c"] or 0, 1),
                "glucose": round(averages["avg_glucose"] or 0, 1),
                "risk_percentage": round(averages["avg_risk"] or 0, 1),
            }
        }


# Auto-initialize database schema when module is imported
init_db()

if __name__ == "__main__":
    print("Testing SQLite database initialization...")
    init_db()
    stats = get_database_stats()
    print(f"Current database stats: {stats}")
