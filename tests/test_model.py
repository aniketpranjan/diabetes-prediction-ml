"""
tests/test_model.py
===================
Unit tests for the trained Diabetes Prediction pipeline and prediction workflow.
Uses Python's standard library (unittest) to avoid unnecessary dependencies.
"""

import sys
import json
import unittest
from pathlib import Path
import numpy as np
import pandas as pd
import joblib

# Ensure project root is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Import top-level functions required for joblib unpickling
from train_model import convert_zeros_to_nan
import __main__
__main__.convert_zeros_to_nan = convert_zeros_to_nan

MODEL_PATH = BASE_DIR / "models" / "diabetes_pipeline.pkl"
METRICS_PATH = BASE_DIR / "models" / "model_comparison.json"


class TestDiabetesPipeline(unittest.TestCase):

    def test_01_model_artifact_exists(self):
        """Verify that the model pipeline file exists in the models directory."""
        self.assertTrue(MODEL_PATH.exists(), f"Model artifact not found at {MODEL_PATH}")

    def test_02_metrics_file_exists_and_valid(self):
        """Verify metrics JSON exists and contains genuine results for all 3 models."""
        self.assertTrue(METRICS_PATH.exists(), f"Metrics file not found at {METRICS_PATH}")
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics = json.load(f)

        self.assertIn("comparison", metrics)
        self.assertIn("best_model", metrics)
        for model_name in ["Logistic Regression", "Decision Tree", "Random Forest"]:
            self.assertIn(model_name, metrics["comparison"])
            stats = metrics["comparison"][model_name]
            self.assertGreaterEqual(stats["Accuracy"], 0.0)
            self.assertLessEqual(stats["Accuracy"], 1.0)
            self.assertGreaterEqual(stats["F1_Score"], 0.0)
            self.assertLessEqual(stats["F1_Score"], 1.0)

    def test_03_pipeline_prediction_workflow(self):
        """Verify that loaded pipeline predicts valid class and probabilities on raw data."""
        pipeline = joblib.load(MODEL_PATH)

        sample_patient = pd.DataFrame([{
            "gender": "Female",
            "age": 45.0,
            "hypertension": 0,
            "heart_disease": 0,
            "smoking_history": "never",
            "bmi": 28.5,
            "HbA1c_level": 5.8,
            "blood_glucose_level": 110.0
        }])

        prediction = pipeline.predict(sample_patient)
        probabilities = pipeline.predict_proba(sample_patient)

        # Check prediction is 0 or 1
        self.assertIn(int(prediction[0]), [0, 1])

        # Check probabilities shape and sum
        self.assertEqual(probabilities.shape, (1, 2))
        self.assertTrue(np.isclose(probabilities.sum(), 1.0, atol=1e-4))
        self.assertGreaterEqual(probabilities[0][0], 0.0)
        self.assertLessEqual(probabilities[0][0], 1.0)

    def test_04_pipeline_handles_unseen_categories_and_zeros(self):
        """Verify the pipeline gracefully handles unseen text values and biologically zero values."""
        pipeline = joblib.load(MODEL_PATH)

        # Edge-case: unseen categories and zeros in BMI/glucose
        edge_patient = pd.DataFrame([{
            "gender": "Other",
            "age": 60.0,
            "hypertension": 1,
            "heart_disease": 0,
            "smoking_history": "not current",
            "bmi": 0.0,                 # Implausible zero: transformed to NaN & imputed
            "HbA1c_level": 0.0,         # Implausible zero: transformed to NaN & imputed
            "blood_glucose_level": 0.0  # Implausible zero: transformed to NaN & imputed
        }])

        # Should execute without errors
        pred = pipeline.predict(edge_patient)
        prob = pipeline.predict_proba(edge_patient)

        self.assertIn(int(pred[0]), [0, 1])
        self.assertTrue(np.isclose(prob.sum(), 1.0, atol=1e-4))


if __name__ == "__main__":
    unittest.main()
