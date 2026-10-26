"""
tests/test_database.py
======================
Unit tests for the SQLite database integration module.
"""

import unittest
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import database as db


class TestSQLiteDatabase(unittest.TestCase):

    def setUp(self):
        db.init_db()

    def test_01_insert_and_retrieve_prediction(self):
        record_id = db.save_prediction(
            patient_name="Test Patient 101",
            gender="Female",
            age=45.0,
            hypertension=1,
            heart_disease=0,
            smoking_history="never",
            bmi=29.2,
            hba1c_level=6.2,
            blood_glucose_level=130.0,
            prediction=1,
            probability=0.6850,
            percentage=68.5,
            risk_tier="High Risk"
        )
        self.assertIsInstance(record_id, int)
        self.assertGreater(record_id, 0)

        # Retrieve and verify record
        records = db.get_predictions(limit=10)
        found = [r for r in records if r["id"] == record_id]
        self.assertEqual(len(found), 1)
        record = found[0]
        self.assertEqual(record["patient_name"], "Test Patient 101")
        self.assertEqual(record["risk_tier"], "High Risk")
        self.assertEqual(record["percentage"], 68.5)

        # Clean up test record
        deleted = db.delete_prediction(record_id)
        self.assertTrue(deleted)

    def test_02_database_stats(self):
        stats = db.get_database_stats()
        self.assertIn("total_screenings", stats)
        self.assertIn("risk_tier_distribution", stats)
        self.assertIn("averages", stats)


if __name__ == "__main__":
    unittest.main()
