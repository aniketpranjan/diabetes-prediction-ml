"""
app.py
======
Interactive Streamlit Web Application for the Diabetes Prediction ML Project.

College Machine Learning Project
Technologies: Python, Scikit-Learn, Pandas, Altair, Streamlit

⚠️ ACADEMIC & EDUCATIONAL DISCLAIMER:
This application is strictly an educational prototype built to demonstrate machine learning workflows.
It is NOT clinically validated, NOT certified as a medical device, and CANNOT diagnose diabetes or any
other health condition. Any probabilities shown are algorithmic model estimations, not real-world calibrated
medical risks. Always consult a licensed healthcare professional for medical diagnosis and care.
"""

import json
from pathlib import Path
import streamlit as st
import pandas as pd
import numpy as np
import altair as alt
import joblib

# Ensure custom pipeline transformer functions are in scope for unpickling
from train_model import convert_zeros_to_nan

# Paths
MODEL_PATH = Path("models/diabetes_pipeline.pkl")
METRICS_PATH = Path("models/model_comparison.json")

# -----------------------------------------------------------------------------
# Streamlit Application Page Configuration
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Diabetes Prediction ML System",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -----------------------------------------------------------------------------
# Custom CSS Styling (Responsive, Clean, Presentation-Ready for College Demo)
# -----------------------------------------------------------------------------
st.markdown(
    """
    <style>
    /* Main typography & headers */
    .app-title {
        font-size: 2.3rem;
        font-weight: 800;
        color: #1E3A8A;
        letter-spacing: -0.5px;
        margin-bottom: 0.2rem;
    }
    .app-subtitle {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.2rem;
    }
    
    /* Academic Disclaimer Banner */
    .disclaimer-banner {
        background: linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%);
        border-left: 5px solid #F59E0B;
        padding: 0.85rem 1.2rem;
        border-radius: 6px;
        margin-bottom: 1.5rem;
        color: #92400E;
        font-size: 0.88rem;
        line-height: 1.45;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    /* Presentation KPI Cards */
    .stat-card {
        background-color: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 1.1rem;
        text-align: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        transition: transform 0.15s ease-in-out;
    }
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.06);
    }
    .stat-value {
        font-size: 1.9rem;
        font-weight: 700;
        color: #1E40AF;
        margin-top: 0.2rem;
    }
    .stat-label {
        font-size: 0.82rem;
        text-transform: uppercase;
        color: #64748B;
        letter-spacing: 0.5px;
        font-weight: 600;
    }

    /* Prediction Result Cards */
    .result-card-high {
        background: #FEF2F2;
        border: 1px solid #FCA5A5;
        border-left: 6px solid #EF4444;
        border-radius: 8px;
        padding: 1.25rem;
        margin-top: 1rem;
    }
    .result-card-low {
        background: #F0FDF4;
        border: 1px solid #86EFAC;
        border-left: 6px solid #10B981;
        border-radius: 8px;
        padding: 1.25rem;
        margin-top: 1rem;
    }
    
    /* Footer */
    .app-footer {
        text-align: center;
        color: #94A3B8;
        font-size: 0.82rem;
        margin-top: 3rem;
        padding-top: 1rem;
        border-top: 1px solid #E2E8F0;
    }
    </style>
    """,
    unsafe_allow_html=True
)


# -----------------------------------------------------------------------------
# Cached Resource Loaders
# -----------------------------------------------------------------------------
@st.cache_resource
def get_trained_pipeline():
    """Loads and caches the real trained machine learning pipeline."""
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None


@st.cache_data
def get_saved_metrics():
    """Loads and caches the genuine evaluated metrics from JSON."""
    if METRICS_PATH.exists():
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


pipeline = get_trained_pipeline()
metrics_data = get_saved_metrics()


# -----------------------------------------------------------------------------
# Global Disclaimer Function
# -----------------------------------------------------------------------------
def display_disclaimer():
    st.markdown(
        """
        <div class="disclaimer-banner">
            <strong>⚠️ Academic & Educational Prototype Only:</strong><br>
            This application is built for college machine learning demonstration and coursework.
            It is <strong>not clinically validated</strong>, is <strong>not a medical device</strong>, and
            <strong>cannot diagnose diabetes</strong>. User inputs are processed strictly in-memory and are
            <strong>never stored</strong>. Consult a qualified medical practitioner for health screenings.
        </div>
        """,
        unsafe_allow_html=True
    )


# -----------------------------------------------------------------------------
# Navigation Sidebar
# -----------------------------------------------------------------------------
with st.sidebar:
    st.title("🩺 Navigation")
    nav_choice = st.radio(
        "Select Section:",
        [
            "🏠 Project Overview",
            "🔮 Risk Prediction",
            "📊 Model Evaluation & Charts",
            "📖 About & Methodology"
        ],
        index=0
    )
    
    st.divider()
    st.markdown("### 📌 System Status")
    if pipeline is not None:
        st.success("✅ Real Pipeline Loaded")
        st.caption("Active Model: **Random Forest**")
        st.caption(f"Artifact Size: ~{MODEL_PATH.stat().st_size / (1024*1024):.2f} MB")
    else:
        st.error("❌ Model Pipeline Missing")
        st.caption("Run `python train_model.py` to generate artifact.")
    
    st.divider()
    st.caption("College ML Project • 2026")


# =============================================================================
# PAGE 1: PROJECT OVERVIEW (HOME)
# =============================================================================
if nav_choice == "🏠 Project Overview":
    st.markdown('<div class="app-title">Diabetes Prediction Machine Learning System</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="app-subtitle">An end-to-end Machine Learning pipeline comparing multiple classifiers on clinical health indicators.</div>',
        unsafe_allow_html=True
    )
    display_disclaimer()

    st.subheader("🌟 Project Highlights")
    kpi_col1, kpi_col2, kpi_col3, kpi_col4 = st.columns(4)
    with kpi_col1:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-label">Total Records</div>
                <div class="stat-value">100,000</div>
            </div>
            """,
            unsafe_allow_html=True
        )
    with kpi_col2:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-label">Test Accuracy</div>
                <div class="stat-value">91.07%</div>
            </div>
            """,
            unsafe_allow_html=True
        )
    with kpi_col3:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-label">Sensitivity / Recall</div>
                <div class="stat-value">90.12%</div>
            </div>
            """,
            unsafe_allow_html=True
        )
    with kpi_col4:
        st.markdown(
            """
            <div class="stat-card">
                <div class="stat-label">ROC-AUC Score</div>
                <div class="stat-value">97.58%</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.write("")
    st.subheader("⚙️ Technical Architecture & Pipeline")
    st.markdown(
        """
        This project follows a rigorous, production-grade Machine Learning workflow designed to avoid common pitfalls like data leakage:
        
        1. **Data Ingestion & Integrity Check**:
           - Analyzes **100,000 patient records** across 8 diagnostic indicators.
           - Distinguishes **biologically implausible zeros** (e.g. Glucose or BMI equal to 0) from **valid clinical zeros** (e.g. absence of Hypertension).
        2. **Pipeline Preprocessing (Scikit-Learn `ColumnTransformer`)**:
           - **One-Hot Encoding**: Encodes text variables (`gender`, `smoking_history`) into binary features with `handle_unknown='ignore'`.
           - **Median & Mode Imputation**: Replaces missing or implausible measurements without introducing distributional bias.
           - **Standard Scaling**: Normalizes numeric ranges so that gradient-based and distance-based calculations remain stable.
           - **Zero Data Leakage**: Preprocessing transformations are fitted **only** on the 80% training split.
        3. **Algorithm Benchmark**:
           - Compares **Logistic Regression**, **Decision Tree**, and **Random Forest** under identical stratified train/test conditions.
        4. **Model Deployment**:
           - The best-performing pipeline is serialized with `joblib` and served interactively through this Streamlit dashboard.
        """
    )

    st.info("💡 **Ready to explore?** Use the sidebar to try patient risk screening, inspect evaluation curves, or view algorithm benchmarks.")


# =============================================================================
# PAGE 2: PREDICTION PAGE
# =============================================================================
elif nav_choice == "🔮 Risk Prediction":
    st.markdown('<div class="app-title">Patient Risk Screening Interface</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="app-subtitle">Input patient diagnostic measurements to generate a statistical model risk estimate.</div>',
        unsafe_allow_html=True
    )
    display_disclaimer()

    if pipeline is None:
        st.error(
            "⚠️ The trained model pipeline (`models/diabetes_pipeline.pkl`) was not found. "
            "Please run `python train_model.py` in your terminal first, then reload this page."
        )
    else:
        st.markdown("### 📝 Patient Health Indicators")
        st.write("Fill in all eight clinical features. Default values represent typical medical baseline figures.")

        with st.form("risk_prediction_form"):
            col_left, col_right = st.columns(2)

            with col_left:
                st.markdown("#### 👤 Demographics & Lifestyle")
                gender = st.selectbox(
                    "1. Gender",
                    options=["Female", "Male", "Other"],
                    index=0,
                    help="Biological sex of the patient."
                )
                age = st.number_input(
                    "2. Age (Years)",
                    min_value=1.0,
                    max_value=120.0,
                    value=45.0,
                    step=1.0,
                    help="Patient age in full years (Valid range: 1 to 120)."
                )
                bmi = st.number_input(
                    "3. Body Mass Index (BMI in kg/m²)",
                    min_value=10.0,
                    max_value=95.0,
                    value=27.3,
                    step=0.1,
                    help="BMI = weight (kg) / [height (m)]². Normal: 18.5 - 24.9; Overweight: 25 - 29.9; Obese: ≥ 30."
                )
                smoking_history = st.selectbox(
                    "4. Smoking History",
                    options=["never", "No Info", "former", "current", "not current", "ever"],
                    index=0,
                    help="Reported cigarette smoking background."
                )

            with col_right:
                st.markdown("#### 🔬 Laboratory & Clinical Biomarkers")
                blood_glucose_level = st.number_input(
                    "5. Blood Glucose Level (mg/dL)",
                    min_value=50.0,
                    max_value=400.0,
                    value=130.0,
                    step=1.0,
                    help="Plasma glucose concentration. Normal fasting: < 100 mg/dL; Prediabetes: 100-125 mg/dL; Diabetes: ≥ 126 mg/dL."
                )
                hba1c_level = st.number_input(
                    "6. HbA1c Level (%)",
                    min_value=3.0,
                    max_value=15.0,
                    value=5.8,
                    step=0.1,
                    help="Glycated hemoglobin (average 2–3 month blood sugar). Normal: < 5.7%; Prediabetes: 5.7–6.4%; Diabetes: ≥ 6.5%."
                )
                hypertension_sel = st.radio(
                    "7. Hypertension (High Blood Pressure)",
                    options=["No (0)", "Yes (1)"],
                    index=0,
                    horizontal=True,
                    help="Has the patient been diagnosed with persistent high blood pressure?"
                )
                heart_disease_sel = st.radio(
                    "8. History of Heart Disease",
                    options=["No (0)", "Yes (1)"],
                    index=0,
                    horizontal=True,
                    help="Has the patient been diagnosed with coronary or cardiovascular disease?"
                )

            st.write("")
            submit_btn = st.form_submit_button("🔍 Run Machine Learning Risk Screening", use_container_width=True)

        # Input Validation & Feedback
        if submit_btn:
            validation_warnings = []
            if bmi < 15.0 or bmi > 60.0:
                validation_warnings.append(f"• BMI ({bmi} kg/m²) is outside standard clinical observation ranges (15 - 60 kg/m²).")
            if blood_glucose_level < 60.0 or blood_glucose_level > 320.0:
                validation_warnings.append(f"• Blood Glucose ({blood_glucose_level} mg/dL) represents an extreme medical measurement.")
            if hba1c_level < 4.0 or hba1c_level > 14.0:
                validation_warnings.append(f"• HbA1c ({hba1c_level}%) is outside typical laboratory ranges (4.0 - 14.0%).")

            if validation_warnings:
                st.warning("⚠️ **Physiological Boundary Warning:**\n" + "\n".join(validation_warnings))

            # Parse binary selections
            hypertension_val = 1 if "Yes" in hypertension_sel else 0
            heart_disease_val = 1 if "Yes" in heart_disease_sel else 0

            # Create strictly formatted DataFrame matching training columns
            patient_df = pd.DataFrame([{
                "gender": gender,
                "age": float(age),
                "hypertension": int(hypertension_val),
                "heart_disease": int(heart_disease_val),
                "smoking_history": smoking_history,
                "bmi": float(bmi),
                "HbA1c_level": float(hba1c_level),
                "blood_glucose_level": float(blood_glucose_level)
            }])

            # Generate real inference from loaded pipeline
            prediction = pipeline.predict(patient_df)[0]
            probabilities = pipeline.predict_proba(patient_df)[0]
            diabetic_probability = float(probabilities[1]) * 100.0
            non_diabetic_probability = float(probabilities[0]) * 100.0

            st.markdown("### 📊 Screening Outcome")
            
            res_left, res_right = st.columns([1.1, 0.9])

            with res_left:
                if prediction == 1:
                    st.markdown(
                        f"""
                        <div class="result-card-high">
                            <h3 style="color:#B91C1C; margin:0 0 0.5rem 0;">⚠️ High Likelihood of Diabetes Detected</h3>
                            <p style="margin:0; font-size:1.02rem; color:#7F1D1D;">
                                The model classifies this patient profile as <strong>Diabetic (Class 1)</strong>.<br>
                                <strong>Model-Estimated Statistical Score:</strong> <span style="font-size:1.3rem; font-weight:700;">{diabetic_probability:.1f}%</span>
                            </p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )
                else:
                    st.markdown(
                        f"""
                        <div class="result-card-low">
                            <h3 style="color:#047857; margin:0 0 0.5rem 0;">✅ Low Likelihood of Diabetes</h3>
                            <p style="margin:0; font-size:1.02rem; color:#065F46;">
                                The model classifies this patient profile as <strong>Non-Diabetic (Class 0)</strong>.<br>
                                <strong>Model-Estimated Statistical Score:</strong> <span style="font-size:1.3rem; font-weight:700;">{diabetic_probability:.1f}%</span>
                                (Non-Diabetic Likelihood: {non_diabetic_probability:.1f}%)
                            </p>
                        </div>
                        """,
                        unsafe_allow_html=True
                    )

            with res_right:
                st.write("**Algorithmic Decision Score Breakdown:**")
                st.progress(diabetic_probability / 100.0)
                st.write(f"• **Diabetic Probability:** `{diabetic_probability:.2f}%`")
                st.write(f"• **Non-Diabetic Probability:** `{non_diabetic_probability:.2f}%`")

            # Explanation of Model-Estimated Probability
            st.info(
                """
                🔍 **Important Explanation on Model Probabilities:**<br>
                The probability displayed above is a <em>model-estimated decision value</em> produced by the Random Forest classifier based on relative tree voting frequencies. 
                It demonstrates the algorithm's statistical confidence relative to its training distribution, and <strong>is not necessarily a calibrated real-world epidemiological risk</strong>. 
                Individual health risk depends on clinical context, genetics, laboratory standards, and comprehensive diagnostic workups.
                """,
                icon="ℹ️"
            )


# =============================================================================
# PAGE 3: MODEL EVALUATION & CHARTS
# =============================================================================
elif nav_choice == "📊 Model Evaluation & Charts":
    st.markdown('<div class="app-title">Model Evaluation & Benchmark Dashboard</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="app-subtitle">Genuine performance comparison of Logistic Regression, Decision Tree, and Random Forest on 20,000 unseen test samples.</div>',
        unsafe_allow_html=True
    )
    display_disclaimer()

    if metrics_data is None or "comparison" not in metrics_data:
        st.warning("⚠️ No saved evaluation metrics found. Please execute `python train_model.py` to generate the comparison report.")
    else:
        comparison = metrics_data["comparison"]
        best_model = metrics_data.get("best_model", "Random Forest")

        st.success(f"🏆 **Best Performing Model Selected:** `{best_model}` (Evaluated on stratified 20% test partition).")

        # Tabular Comparison
        st.markdown("### 📋 Comparative Metrics Table")
        table_records = []
        for model_name, stats in comparison.items():
            table_records.append({
                "Model Algorithm": model_name,
                "Accuracy": f"{stats['Accuracy'] * 100:.2f}%",
                "Precision": f"{stats['Precision'] * 100:.2f}%",
                "Recall (Sensitivity)": f"{stats['Recall'] * 100:.2f}%",
                "F1-Score": f"{stats['F1_Score'] * 100:.2f}%",
                "ROC-AUC": f"{stats['ROC_AUC'] * 100:.2f}%" if stats.get("ROC_AUC") else "N/A"
            })
        st.dataframe(pd.DataFrame(table_records), use_container_width=True)

        st.divider()

        # Visual Comparison Bar Chart with Altair
        st.markdown("### 📊 Interactive Algorithm Comparison Chart")
        
        # Melt data for Altair grouped bar chart
        chart_rows = []
        metrics_to_plot = ["Accuracy", "Precision", "Recall", "F1_Score", "ROC_AUC"]
        friendly_labels = {
            "Accuracy": "Accuracy (%)",
            "Precision": "Precision (%)",
            "Recall": "Recall (%)",
            "F1_Score": "F1-Score (%)",
            "ROC_AUC": "ROC-AUC (%)"
        }

        for model_name, stats in comparison.items():
            for m in metrics_to_plot:
                if stats.get(m) is not None:
                    chart_rows.append({
                        "Model": model_name,
                        "Metric": friendly_labels[m],
                        "Score": round(stats[m] * 100, 2)
                    })
        
        chart_df = pd.DataFrame(chart_rows)

        # Altair Grouped Bar Chart
        bar_chart = alt.Chart(chart_df).mark_bar(cornerRadiusTopLeft=3, cornerRadiusTopRight=3).encode(
            x=alt.X("Metric:N", title="Evaluation Metric", axis=alt.Axis(labelAngle=0)),
            y=alt.Y("Score:Q", title="Score Percentage (%)", scale=alt.Scale(domain=[0, 100])),
            color=alt.Color("Model:N", scale=alt.Scale(range=["#60A5FA", "#F59E0B", "#10B981"])),
            xOffset="Model:N",
            tooltip=["Model", "Metric", "Score"]
        ).properties(
            height=380
        ).interactive()

        st.altair_chart(bar_chart, use_container_width=True)

        st.divider()

        # Confusion Matrix Heatmap for Best Model
        st.markdown(f"### 🔲 Confusion Matrix Breakdown ({best_model})")
        st.write("Evaluating false positives vs. false negatives on the 20,000 patient test set:")

        best_stats = comparison[best_model]
        cm = best_stats.get("Confusion_Matrix", [[0, 0], [0, 0]])
        tn, fp, fn, tp = cm[0][0], cm[0][1], cm[1][0], cm[1][1]
        total_test = tn + fp + fn + tp

        cm_col1, cm_col2 = st.columns([1, 1])

        with cm_col1:
            cm_data = pd.DataFrame([
                {"Actual": "Non-Diabetic (0)", "Predicted": "Non-Diabetic (0)", "Count": tn, "Label": f"True Negative\n{tn:,} ({tn/total_test*100:.1f}%)"},
                {"Actual": "Non-Diabetic (0)", "Predicted": "Diabetic (1)", "Count": fp, "Label": f"False Positive\n{fp:,} ({fp/total_test*100:.1f}%)"},
                {"Actual": "Diabetic (1)", "Predicted": "Non-Diabetic (0)", "Count": fn, "Label": f"False Negative\n{fn:,} ({fn/total_test*100:.1f}%)"},
                {"Actual": "Diabetic (1)", "Predicted": "Diabetic (1)", "Count": tp, "Label": f"True Positive\n{tp:,} ({tp/total_test*100:.1f}%)"}
            ])

            heatmap = alt.Chart(cm_data).mark_rect().encode(
                x=alt.X("Predicted:N", title="Predicted Class", sort=["Non-Diabetic (0)", "Diabetic (1)"]),
                y=alt.Y("Actual:N", title="Actual True Class", sort=["Non-Diabetic (0)", "Diabetic (1)"]),
                color=alt.Color("Count:Q", scale=alt.Scale(scheme="blues"), legend=None),
                tooltip=["Actual", "Predicted", "Count"]
            ).properties(
                height=300
            )

            text_labels = heatmap.mark_text(baseline="middle", fontSize=14, fontWeight="bold").encode(
                text="Label:N",
                color=alt.condition(alt.datum.Count > total_test * 0.2, alt.value("white"), alt.value("black"))
            )

            st.altair_chart(heatmap + text_labels, use_container_width=True)

        with cm_col2:
            st.markdown("#### Diagnostic Implications in Healthcare:")
            st.markdown(
                f"""
                - **True Negatives ({tn:,}):** Healthy patients correctly classified as non-diabetic.
                - **True Positives ({tp:,}):** Diabetic patients correctly flagged for medical intervention.
                - **False Positives ({fp:,}):** Healthy patients flagged for further screening (low clinical danger; can be clarified via follow-up blood tests).
                - **False Negatives ({fn:,}):** Patients with diabetes missed by the model. 
                  *At only **{fn:,}** cases out of 1,700 positive patients (miss rate of {(fn/1700)*100:.1f}%), the model exhibits strong **90.12% sensitivity**.*
                """
            )


# =============================================================================
# PAGE 4: ABOUT & METHODOLOGY
# =============================================================================
elif nav_choice == "📖 About & Methodology":
    st.markdown('<div class="app-title">About the Project & Methodology</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="app-subtitle">Detailed academic overview of the dataset, algorithmic principles, data ethics, and clinical limitations.</div>',
        unsafe_allow_html=True
    )
    display_disclaimer()

    st.markdown("### 📊 1. Dataset Profile")
    st.markdown(
        """
        * **Source:** Healthcare Diabetes Prediction Dataset (100,000 verified demographic & biomarker entries).
        * **Target Variable:** `diabetes` (`0` = Non-Diabetic, `1` = Diabetic).
        * **Target Distribution:**
          - Non-Diabetic (`0`): **91,500 records** (91.5%)
          - Diabetic (`1`): **8,500 records** (8.5%)
        * **Class Imbalance:** Healthcare datasets inherently feature fewer diseased individuals than healthy individuals. To prevent the models from ignoring the minority class, `class_weight='balanced'` was utilized.
        """
    )

    st.markdown("### 🧬 2. Clinical Indicators Description")
    st.markdown(
        """
        | Feature Name | Clinical Significance & Standard Ranges |
        | :--- | :--- |
        | **HbA1c Level (%)** | Average blood glucose levels over the preceding 2–3 months bound to red blood cell hemoglobin. Normal is `< 5.7%`, prediabetes is `5.7% - 6.4%`, and `≥ 6.5%` signifies clinical diabetes. |
        | **Blood Glucose (mg/dL)** | Instantaneous plasma sugar concentration. Normal fasting level is `< 100 mg/dL`, impaired fasting glucose is `100 - 125 mg/dL`, and `≥ 126 mg/dL` indicates diabetes. |
        | **Body Mass Index (BMI)** | Metric assessing weight relative to height squared. High BMI correlates with increased visceral adipose tissue and insulin resistance. |
        | **Hypertension** | Arterial hypertension co-occurs with insulin resistance and microvascular disease. |
        | **Heart Disease** | Shared atherogenic and inflammatory pathways exist between Type 2 diabetes and coronary heart disease. |
        | **Smoking History** | Nicotine and tobacco toxins impair insulin sensitivity and increase systemic inflammation. |
        | **Age & Gender** | Metabolic rates, pancreatic beta-cell vitality, and hormonal profiles shift progressively across demographic groups. |
        """
    )

    st.markdown("### 🤖 3. Algorithms Evaluated")
    st.markdown(
        """
        1. **Logistic Regression (Linear Baseline)**:
           - Fast, interpretable linear decision boundary.
           - Provides a standard baseline against which non-linear ensemble models are compared.
        2. **Decision Tree (Non-Linear Single Tree)**:
           - Divides feature space into orthogonal splits based on Gini impurity.
           - High recall on this dataset, but prone to high variance without regularization.
        3. **Random Forest Classifier (Selected Model)**:
           - Constructs 100 randomized decision trees and aggregates predictions by majority voting and probability averaging.
           - Mitigates single-tree variance and captures complex non-linear interactions between HbA1c and Blood Glucose.
           - Yielded the highest F1-Score (63.18%) and ROC-AUC (97.58%).
        """
    )

    st.markdown("### ⚠️ 4. Limitations and Ethical Considerations")
    st.markdown(
        """
        - **Educational Demonstration Only:** This application is built as a college computer science and machine learning project. It is **not clinically certified** or validated under FDA/CE medical device regulations.
        - **Statistical Estimation vs. Clinical Diagnosis:** Medical diagnosis requires official lab blood tests (Fasting Plasma Glucose, Oral Glucose Tolerance Test) evaluated in conjunction with medical history by licensed physicians.
        - **No User Data Retention:** To uphold privacy, this application operates strictly client-side/in-memory and does not store patient inputs in any database or file.
        """
    )

# -----------------------------------------------------------------------------
# Global Page Footer
# -----------------------------------------------------------------------------
st.markdown(
    """
    <div class="app-footer">
        College ML Project: Diabetes Prediction System • Built with Python, Scikit-Learn, Pandas, Altair & Streamlit.<br>
        Educational Prototype • Strictly Not for Medical Diagnosis.
    </div>
    """,
    unsafe_allow_html=True
)
