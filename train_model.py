"""
train_model.py
================
Model training and evaluation pipeline for the Diabetes Prediction System.

Requirements implemented:
- Uses Pandas and Scikit-Learn.
- Handles biologically implausible zero values ONLY in clinical measurements (e.g., BMI, HbA1c, glucose),
  preserving valid zeros in binary indicators (hypertension, heart_disease).
- Compares Logistic Regression, Decision Tree, and Random Forest.
- Stratified train-test split with a fixed random seed for reproducibility.
- Unified Scikit-Learn Pipeline: preprocessing is fitted ONLY on training data.
- Full genuine metrics: Accuracy, Precision, Recall, F1-Score, Confusion Matrix, ROC-AUC.
- Saves the best performing fitted pipeline using joblib in models/diabetes_pipeline.pkl.
- Includes disclaimer: Educational prototype, not for clinical diagnosis.
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd
import joblib

# Scikit-learn tools
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Algorithms
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Evaluation metrics
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# Paths and Configuration
DATA_PATH = Path("data/diabetes_prediction_dataset.csv")
MODEL_DIR = Path("models")
BEST_MODEL_PATH = MODEL_DIR / "diabetes_pipeline.pkl"
METRICS_PATH = MODEL_DIR / "model_comparison.json"

RANDOM_SEED = 42

TARGET_COLUMN = "diabetes"

# Features where 0 is BIOLOGICALLY IMPLAUSIBLE in a living patient
# (Zero indicates missing/unrecorded medical data, so 0 is treated as missing)
IMPLAUSIBLE_ZERO_FEATURES = [
    "bmi",
    "HbA1c_level",
    "blood_glucose_level"
]

# Features where 0 is a VALID clinical measurement
# (0 = Absence of condition / normal)
VALID_ZERO_FEATURES = [
    "hypertension",
    "heart_disease"
]

# Other numerical features
OTHER_NUMERICAL_FEATURES = [
    "age"
]

ALL_NUMERICAL_FEATURES = IMPLAUSIBLE_ZERO_FEATURES + VALID_ZERO_FEATURES + OTHER_NUMERICAL_FEATURES

CATEGORICAL_FEATURES = [
    "gender",
    "smoking_history"
]


def replace_implausible_zeros(df: pd.DataFrame) -> pd.DataFrame:
    """
    Replaces zero values with NaN ONLY in features where zero is biologically impossible
    (e.g., BMI, HbA1c, blood glucose). Leaves valid zero measurements intact.
    """
    df_clean = df.copy()
    for col in IMPLAUSIBLE_ZERO_FEATURES:
        if col in df_clean.columns:
            zero_count = (df_clean[col] == 0).sum()
            if zero_count > 0:
                print(f"      [Data Check] Found {zero_count} implausible zeros in '{col}'. Replacing with NaN for imputation.")
                df_clean[col] = df_clean[col].replace(0, np.nan)
    return df_clean


def convert_zeros_to_nan(X):
    """
    Top-level helper function to convert implausible 0 values to NaN.
    Defined at top-level scope so that Scikit-Learn Pipeline can be pickled by joblib.
    """
    return np.where(X == 0, np.nan, X)


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs a ColumnTransformer that operates strictly within the training pipeline.
    
    1. Clinical measurements (implausible zeros):
       - FunctionTransformer to map zeros to NaN
       - Median SimpleImputer
       - StandardScaler
    2. Valid numerical features (hypertension, heart disease, age):
       - Median SimpleImputer (preserves 0 as a valid observation)
       - StandardScaler
    3. Categorical features (gender, smoking_history):
       - Most-frequent SimpleImputer
       - OneHotEncoder (handle_unknown='ignore' so unseen inputs never crash the web app)
    """
    # Pipeline for features where 0 is invalid
    implausible_zero_transformer = Pipeline(steps=[
        ("zero_to_nan", FunctionTransformer(convert_zeros_to_nan, validate=False)),
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    # Pipeline for standard numerical features (0 is valid)
    standard_numerical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    # Pipeline for categorical features
    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("imp_zero_num", implausible_zero_transformer, IMPLAUSIBLE_ZERO_FEATURES),
            ("valid_zero_num", standard_numerical_transformer, VALID_ZERO_FEATURES + OTHER_NUMERICAL_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES)
        ]
    )

    return preprocessor


def get_candidate_models():
    """Returns candidate classification algorithms to compare."""
    return {
        "Logistic Regression": LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            random_state=RANDOM_SEED
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=8,
            class_weight="balanced",
            random_state=RANDOM_SEED
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=100,
            max_depth=12,
            class_weight="balanced",
            random_state=RANDOM_SEED,
            n_jobs=-1
        )
    }


def train_and_compare_models():
    """
    Loads data, trains 3 models inside Scikit-Learn pipelines,
    evaluates them on the test set, and saves the best model.
    """
    print("=" * 75)
    print(" DIABETES PREDICTION SYSTEM - MODEL COMPARISON & TRAINING PIPELINE ")
    print("=" * 75)
    print("[DISCLAIMER] EDUCATIONAL PROTOTYPE ONLY:")
    print("   This project is an academic prototype for educational demonstration.")
    print("   It is NOT a certified medical device and must NOT be used for clinical diagnosis.")
    print("=" * 75)

    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at '{DATA_PATH}'.")

    # 1. Load Data
    print(f"\n[Step 1/5] Loading dataset from '{DATA_PATH}'...")
    df = pd.read_csv(DATA_PATH)
    print(f"           Dataset loaded: {df.shape[0]:,} rows, {df.shape[1]} columns.")

    # 2. Inspect implausible zeros
    print("\n[Step 2/5] Inspecting biologically implausible zero values...")
    for col in IMPLAUSIBLE_ZERO_FEATURES:
        z_count = (df[col] == 0).sum()
        print(f"           Feature '{col}': {z_count} zero values found.")
    for col in VALID_ZERO_FEATURES:
        z_count = (df[col] == 0).sum()
        print(f"           Feature '{col}': {z_count} valid zero values preserved (absence of condition).")

    # 3. Train-Test Split with Stratification
    print(f"\n[Step 3/5] Performing Stratified Train-Test Split (80% Train, 20% Test, seed={RANDOM_SEED})...")
    X = df[ALL_NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.20,
        random_state=RANDOM_SEED,
        stratify=y
    )
    print(f"           Training set : {X_train.shape[0]:,} samples")
    print(f"           Testing set  : {X_test.shape[0]:,} samples")
    print(f"           Class balance: Non-Diabetic={int((y==0).sum()):,}, Diabetic={int((y==1).sum()):,}")

    # 4. Compare Models
    print("\n[Step 4/5] Training and Evaluating Candidate Models...")
    candidates = get_candidate_models()
    results = {}
    fitted_pipelines = {}

    for name, classifier in candidates.items():
        print(f"\n   --> Training: {name}...")
        
        # Build complete pipeline (Preprocessing + Classifier)
        pipeline = Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("classifier", classifier)
        ])

        # Preprocessing is fitted ONLY on training data
        pipeline.fit(X_train, y_train)
        fitted_pipelines[name] = pipeline

        # Predictions on unseen test set
        y_pred = pipeline.predict(X_test)
        if hasattr(pipeline, "predict_proba"):
            y_pred_proba = pipeline.predict_proba(X_test)[:, 1]
            roc_auc = float(roc_auc_score(y_test, y_pred_proba))
        else:
            roc_auc = None

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        cm = confusion_matrix(y_test, y_pred).tolist()

        results[name] = {
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1_Score": f1,
            "ROC_AUC": roc_auc,
            "Confusion_Matrix": cm
        }

        print(f"       Accuracy  : {acc * 100:.2f}%")
        print(f"       Precision : {prec * 100:.2f}%")
        print(f"       Recall    : {rec * 100:.2f}%")
        print(f"       F1-Score  : {f1 * 100:.2f}%")
        if roc_auc is not None:
            print(f"       ROC-AUC   : {roc_auc * 100:.2f}%")
        print(f"       Confusion Matrix: TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")

    # 5. Model Selection & Saving
    print("\n[Step 5/5] Selecting and Saving the Best Model...")
    
    # We rank by F1-Score as primary metric due to healthcare class imbalance
    best_model_name = max(results, key=lambda k: results[k]["F1_Score"])
    best_pipeline = fitted_pipelines[best_model_name]
    best_stats = results[best_model_name]

    print(f"   [RESULT] Best Model Selected: {best_model_name} (F1-Score: {best_stats['F1_Score']*100:.2f}%, ROC-AUC: {best_stats['ROC_AUC']*100:.2f}%)")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipeline, BEST_MODEL_PATH)
    print(f"   Saved fitted pipeline to: {BEST_MODEL_PATH}")

    # Save metrics JSON for documentation & frontend inspection
    metrics_payload = {
        "disclaimer": "Academic prototype only; not certified for clinical diagnosis.",
        "random_seed": RANDOM_SEED,
        "test_size": 0.20,
        "best_model": best_model_name,
        "comparison": results
    }
    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=4)
    print(f"   Saved comparison metrics to: {METRICS_PATH}")

    print("\n" + "=" * 75)
    print(" TRAINING COMPLETE ")
    print("=" * 75)
    return results, best_model_name


if __name__ == "__main__":
    train_and_compare_models()
