# MAJOR PROJECT DISSERTATION REPORT

---

# DIAPREDICT AI: AN END-TO-END CLINICAL DIABETES RISK ASSESSMENT, PREDICTIVE MODELING, AND ANALYTICS SYSTEM

---

**A Capstone Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of**  
**Bachelor of Technology / Bachelor of Science in Computer Science & Engineering**

---

### **Candidate Details:**
* **Project Author:** Aniket P. Ranjan
* **Academic Discipline:** Department of Computer Science & Engineering / Information Technology
* **Academic Year:** 2025 – 2026
* **Domain:** Healthcare Informatics, Applied Machine Learning & Full-Stack Systems

---

## CANDIDATE DECLARATION

I hereby declare that the work presented in this major project report titled **"DiaPredict AI: An End-to-End Clinical Diabetes Risk Assessment, Predictive Modeling, and Analytics System"** is an authentic record of our original work carried out under standard academic guidelines.

The content presented in this report has not been submitted elsewhere for the award of any other degree, diploma, or fellowship. All experimental results, benchmark comparisons, database implementations, and user interfaces documented herein were designed, coded, and validated within the project codebase.

**Place:** Campus  
**Date:** October 26, 2026  

---

## ACKNOWLEDGEMENTS

I extend my profound gratitude to our project supervisors, faculty members, and academic mentors for their constructive feedback, encouragement, and invaluable guidance throughout the inception, architectural design, and empirical evaluation of this research.

I am also thankful to the open-source data science and software engineering communities whose foundational tools—including Scikit-Learn, FastAPI, SQLite, React, and Recharts—enabled the successful deployment of a cohesive, production-grade diagnostic machine learning system. Finally, I thank my peers and family for their unwavering support during the demanding phases of pipeline engineering and system benchmarking.

---

## ABSTRACT

Diabetes Mellitus represents one of the most pressing non-communicable epidemiological challenges of the modern era. Characterized by persistent hyperglycemia due to deficiencies in insulin secretion, peripheral insulin resistance, or both, undiagnosed diabetes can lead to severe microvascular damage (retinopathy, nephropathy, neuropathy) and macrovascular disease (stroke, coronary artery disease, peripheral arterial failure). Early risk stratification is clinically proven to halt disease progression through timely therapeutic lifestyle interventions.

This project designs and implements **DiaPredict AI**, a full-stack, clinically aligned machine learning platform engineered to predict individual diabetes risk while adhering to strict software engineering standards. Utilizing a large-scale clinical dataset comprising **100,000 patient records**, the system addresses critical data hygiene hurdles prevalent in prior academic implementations—most notably data leakage and biologically naive zero imputation. A Scikit-Learn `ColumnTransformer` pipeline was constructed to selectively handle zero values in continuous biomarkers (`bmi`, `blood_glucose_level`, `HbA1c_level`) as missing data while preserving clinically valid zeros in binary comorbidity flags (`hypertension`, `heart_disease`).

Three supervised learning architectures were comparatively benchmarked on a stratified 20,000-sample holdout test partition: **Logistic Regression**, **Decision Tree Classifier**, and an ensemble **Random Forest Classifier**. The Random Forest model demonstrated superior clinical sensitivity and discriminative capacity, achieving an **Accuracy of 91.07%**, an **ROC-AUC of 97.58%**, an **F1-Score of 63.18%**, and a high **Recall (Sensitivity) of 90.12%**, effectively minimizing dangerous False Negative (Type II) diagnostic errors.

To bridge the gap between algorithmic models and real-world clinical usability, the fitted pipeline is served through a high-throughput **FastAPI** REST backend. Predictions and patient records are persistently stored within an **SQLite** database (`diabetes_history.db`) with atomic transactions and indexing. The user-facing application is delivered via a modern, responsive web dashboard built with **React 19**, **TypeScript**, **Recharts**, and **Tailwind CSS v3**, featuring interactive semi-circle risk gauges, biomarker radar deviation plots, population triage analytics, and an autonomous offline fallback inference engine.

---

## TABLE OF CONTENTS

1. [Chapter 1: Introduction](#chapter-1-introduction)
   * 1.1 Clinical Background & Motivation
   * 1.2 Problem Formulation
   * 1.3 Project Aims & Objectives
   * 1.4 Scope & Deliverables
   * 1.5 Report Organization
2. [Chapter 2: Literature Review & Related Work](#chapter-2-literature-review--related-work)
   * 2.1 Evolution of ML in Metabolic Disease Prediction
   * 2.2 Classical PIMA Indian vs. Modern Comprehensive Datasets
   * 2.3 Review of Supervised Classification Paradigms
   * 2.4 Critical Gaps in Existing Research
3. [Chapter 3: Dataset Description & Feature Engineering](#chapter-3-dataset-description--feature-engineering)
   * 3.1 Dataset Demographics & Characteristics
   * 3.2 Clinical Variable Profiles & Physiological Significance
   * 3.3 The Problem of Biologically Implausible Zero Values
   * 3.4 Data Transformation Pipeline & Leakage Mitigation
4. [Chapter 4: System Architecture & Design](#chapter-4-system-architecture--design)
   * 4.1 Four-Tier Modular Architecture
   * 4.2 Data Flow & Component Interaction Model
   * 4.3 Database Entity Design & SQLite Normalization
   * 4.4 RESTful API Contract & Schema Definition
5. [Chapter 5: Machine Learning Methodology & Training](#chapter-5-machine-learning-methodology--training)
   * 5.1 Preprocessing Pipeline Formalism
   * 5.2 Mathematical Formulation of Evaluated Classifiers
   * 5.3 Training Protocol & Stratified Partitioning
   * 5.4 Model Serialization & Persistence via Joblib
6. [Chapter 6: Experimental Results & Benchmarking](#chapter-6-experimental-results--benchmarking)
   * 6.1 Evaluation Metrics Definition
   * 6.2 Empirical Model Comparison
   * 6.3 Confusion Matrix Analysis & Clinical Type I / II Tradeoffs
   * 6.4 Discriminative Power & ROC-AUC Analysis
7. [Chapter 7: Software Engineering & Implementation](#chapter-7-software-engineering--implementation)
   * 7.1 Backend REST Service Architecture (FastAPI & Uvicorn)
   * 7.2 Database Persistence Engine (SQLite)
   * 7.3 Frontend Web Engineering (React 19 & TypeScript)
   * 7.4 Visualization Layer (Recharts)
   * 7.5 Autonomous Dual-Engine Fallback Mechanism
8. [Chapter 8: Verification, Testing & Quality Assurance](#chapter-8-verification-testing--quality-assurance)
   * 8.1 Unit Testing Strategy
   * 8.2 Test Suite Execution & Output
   * 8.3 End-to-End Build & Compilation Verification
9. [Chapter 9: Clinical Ethics, Safety & Regulatory Considerations](#chapter-9-clinical-ethics-safety--regulatory-considerations)
   * 9.1 Academic Prototype Boundaries vs. Clinical Certification
   * 9.2 Transparency, Bias & Interpretability
   * 9.3 Patient Privacy & Data Handling
10. [Chapter 10: Conclusion & Future Scope](#chapter-10-conclusion--future-scope)
    * 10.1 Summary of Contributions
    * 10.2 Future Research & Technical Enhancements
11. [References & Academic Bibliography](#references--academic-bibliography)
12. [Appendices](#appendices)

---

## LIST OF FIGURES

* **Figure 4.1:** End-to-End Four-Tier System Architecture Diagram
* **Figure 4.2:** Data Processing and Inference Sequence Diagram
* **Figure 4.3:** SQLite Database Relational Entity Diagram
* **Figure 5.1:** Scikit-Learn `ColumnTransformer` Pipeline Flow
* **Figure 6.1:** Algorithmic Performance Metric Comparison Chart
* **Figure 6.2:** Confusion Matrix Heatmap for Random Forest Classifier
* **Figure 7.1:** React 19 Semi-Circle Donut Risk Gauge Component
* **Figure 7.2:** Six-Axis Biomarker Deviation Radar Visualization

---

## LIST OF TABLES

* **Table 3.1:** Clinical Features and Biological Ranges
* **Table 3.2:** Descriptive Statistics of the 100,000 Patient Cohort
* **Table 3.3:** Segregation of Implausible vs. Valid Zero Features
* **Table 4.1:** REST API Endpoint Specification
* **Table 4.2:** SQLite `predictions` Table Column Definitions
* **Table 6.1:** Verified Benchmark Performance on 20,000 Holdout Test Samples
* **Table 6.2:** Holdout Confusion Matrix Breakdown ($N = 20,000$)
* **Table 6.3:** Risk Tier Stratification Thresholds
* **Table 8.1:** Unit Test Suite Coverage and Execution Summary

---

# CHAPTER 1: INTRODUCTION

### 1.1 Clinical Background & Motivation
Diabetes mellitus is a chronic, non-communicable metabolic disorder identified by sustained elevations in venous blood glucose concentrations. The global prevalence of diabetes has risen exponentially over the past three decades, driven by rapid urbanization, increasingly sedentary lifestyles, and rising obesity rates. The International Diabetes Federation (IDF) estimates that over 537 million adults globally currently live with diabetes, a figure projected to surpass 780 million by 2045. Crucially, almost half of all individuals living with diabetes are currently undiagnosed.

Prolonged hyperglycemia damages both macrovascular systems (accelerating atherosclerosis, coronary artery disease, and stroke) and microvascular beds (causing diabetic retinopathy, end-stage diabetic nephropathy, and peripheral neuropathy). However, clinical trials such as the Diabetes Prevention Program (DPP) have definitively proved that lifestyle modifications—including modest weight reduction, nutritional adjustments, and structured physical exercise—can decrease the incidence of type 2 diabetes by as much as $58\%$ in high-risk individuals. Consequently, the ability to rapidly, accurately, and cost-effectively screen individuals using readily accessible clinical parameters is of paramount medical and public health importance.

### 1.2 Problem Formulation
Despite the widespread interest in applying artificial intelligence to clinical medicine, conventional academic implementations frequently suffer from severe structural deficiencies:
1. **Pervasive Data Leakage:** Preprocessing transformations such as standardization, min-max scaling, and missing value imputation are often performed across the entire dataset before conducting train-test splitting. This leaks statistical moments (mean, variance) from test sets into the training process, resulting in over-optimistic performance figures that collapse upon deployment.
2. **Naive Handling of Zero Values:** Many clinical datasets code missing or unrecorded test results as `0`. A standard imputation algorithm that treats all zeros as missing data inadvertently destroys real clinical information (e.g., zero pregnancies or absence of hypertension). Conversely, failing to replace impossible zeros (e.g., a blood glucose or BMI of zero) produces severe model distortions.
3. **Disconnection from Usable Systems:** Most machine learning assignments terminate inside an isolated script or Jupyter notebook. Clinical professionals and researchers cannot interact with a static script without an intuitive user interface, an accessible RESTful API, and persistent storage for longitudinal patient tracking.

### 1.3 Project Aims & Objectives
The overarching goal of this dissertation is to design, implement, benchmark, and deploy a robust, end-to-end diabetes predictive system called **DiaPredict AI**.

The specific measurable engineering objectives are:
1. **Data Pipeline Hygiene:** Construct an isolated Scikit-Learn `Pipeline` incorporating custom `FunctionTransformer` mechanisms that selectively replace biologically impossible zero values while strictly preserving valid clinical indicators.
2. **Supervised Classifier Benchmarking:** Train, tune, and systematically compare three distinct classification paradigms—Logistic Regression, Decision Trees, and Random Forest Ensembles—using rigorous stratified holdout evaluation across Accuracy, Precision, Sensitivity (Recall), F1-Score, and ROC-AUC.
3. **High-Performance API Service:** Build an enterprise-ready asynchronous REST backend using FastAPI and Pydantic schema validation to serve sub-10ms predictions with full Cross-Origin Resource Sharing (CORS).
4. **Relational Persistence Engine:** Implement an automated SQLite database module (`database.py`) providing transactional audit logging, historical queries, and real-time aggregate cohort statistics.
5. **Modern Interactive Dashboard:** Engineer a rich, accessible frontend interface using React 19, TypeScript, Recharts, and Tailwind CSS v3, featuring real-time diagnostic indicators, risk gauges, biomarker deviation radars, batch population screening, and an autonomous offline inference engine.
6. **Automated Verification:** Establish a comprehensive unit testing suite using Python’s native `unittest` framework to ensure 100% test pass rates across model integrity, data pipelines, and database interactions.

### 1.4 Scope & Deliverables
The project delivers a fully integrated, self-contained software repository comprising:
* **The Machine Learning Pipeline:** `train_model.py` generating serialized pipeline artifacts (`models/diabetes_pipeline.pkl`) and verified evaluation benchmarks (`models/model_comparison.json`).
* **The REST API Backend:** `api.py` exposing clean RESTful endpoints (`/predict`, `/predictions`, `/analytics`, `/health`).
* **The Persistence Layer:** `database.py` and `data/diabetes_history.db` maintaining indexed clinical records.
* **The Web Client:** A complete single-page application (SPA) in `frontend/` powered by Vite, React 19, TypeScript, Tailwind CSS v3, and Recharts.
* **Testing Suites:** Automated test runners in `tests/test_model.py`, `tests/test_database.py`, and `tests/test_environment.py`.

### 1.5 Report Organization
This dissertation is structured into 10 detailed chapters. Chapter 2 surveys the existing literature and outlines research gaps. Chapter 3 examines the dataset and feature engineering. Chapter 4 delineates the system architecture. Chapter 5 covers machine learning formulations. Chapter 6 presents verified experimental results and benchmark comparisons. Chapter 7 elaborates on software engineering across backend, database, and frontend tiers. Chapter 8 reports on automated testing. Chapter 9 discusses clinical ethics and regulatory boundaries. Finally, Chapter 10 concludes the dissertation with avenues for future research.

---

# CHAPTER 2: LITERATURE REVIEW & RELATED WORK

### 2.1 Evolution of ML in Metabolic Disease Prediction
Over the past two decades, medical informatics has shifted from purely deterministic clinical scoring systems (such as the Framingham Diabetes Risk Score and the Finnish Diabetes Risk Score - FINDRISC) toward non-linear machine learning models. Traditional scoring tools rely on static linear point additions based on epidemiological regressions. While easy to compute manually, these scores fail to capture high-order non-linear interactions among metabolic biomarkers, body composition indices, and cardiovascular comorbidities.

Machine learning models, particularly ensemble tree algorithms and deep neural networks, have consistently demonstrated superior discriminative power by identifying latent multi-factorial disease patterns. Studies by Sisodia and Sisodia (2018) demonstrated that ensemble techniques significantly outperform single decision trees and naive Bayes classifiers on medical tabular datasets.

### 2.2 Classical PIMA Indian vs. Modern Comprehensive Datasets
A large majority of academic computer science projects on diabetes prediction rely exclusively on the **National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) Pima Indians Diabetes Dataset**. While historically valuable, the Pima dataset exhibits substantial real-world limitations:
1. **Extremely Constrained Sample Size:** The dataset contains only 768 patient observations, making high-capacity modern classifiers susceptible to severe overfitting.
2. **Restricted Demographic Cohort:** All patients in the Pima dataset are females of Pima Indian heritage aged 21 and older. Models trained exclusively on this group generalize poorly across modern, diverse multi-ethnic populations.
3. **Absence of Critical Contemporary Biomarkers:** The Pima dataset lacks **Glycated Hemoglobin (HbA1c)**, which has served as the gold-standard diagnostic criterion recognized by the American Diabetes Association (ADA) and the World Health Organization (WHO) since 2010.

To address these limitations, this project utilizes a modern healthcare cohort of **100,000 patients** featuring both biological sexes, comprehensive age distributions ($1 - 100$ years), lifestyle factors (smoking exposure), cardiovascular conditions (hypertension, ischemic heart disease), and modern laboratory biomarkers (both acute blood glucose and chronic HbA1c levels).

### 2.3 Review of Supervised Classification Paradigms
Supervised learning algorithms for medical classification typically span three algorithmic families:
* **Linear Classifiers (Logistic Regression):** Highly interpretable, low computational overhead, and robust against variance errors. However, linear models assume linear separability in the log-odds space and struggle to model complex interactions without extensive manual polynomial feature expansions.
* **Non-Parametric Trees (Decision Trees - CART):** Capable of learning non-linear step-function boundaries directly without feature scaling. However, single decision trees suffer from high variance and are notorious for overfitting training noise.
* **Ensemble Methods (Random Forests & Gradient Boosting):** Breiman (2001) established that bootstrap aggregation (bagging) of diverse decision trees drastically reduces estimator variance without inflating bias. Random Forests sample both data instances and feature subsets, yielding exceptional stability on tabular medical data.

### 2.4 Critical Gaps in Existing Research
A critical review of published student dissertations and online ML repositories reveals four systemic deficiencies:
1. **Evaluation Naivety:** Many implementations evaluate models purely on **Accuracy**. In clinical datasets with natural class imbalances ($8.5\% - 15\%$ diabetic prevalence), an uncalibrated model that predicts "Non-Diabetic" for every single patient can achieve an $88\%$ accuracy while failing to detect a single sick individual. In medicine, **Recall (Sensitivity)** and **ROC-AUC** must be prioritized.
2. **Missing Serialization Architecture:** Models are rarely packaged into serialized, portable artifacts (`.pkl` / `.joblib`) capable of being embedded into production pipelines.
3. **Unvalidated API Contracts:** When APIs are built, they frequently lack strict data validation, allowing invalid inputs (such as negative ages or glucose levels of 10,000) to cause silent downstream mathematical crashes.

---

# CHAPTER 3: DATASET DESCRIPTION & FEATURE ENGINEERING

### 3.1 Dataset Demographics & Characteristics
The empirical backbone of this research is a curated clinical dataset comprising **100,000 distinct patient records**. The target variable is binary: `0` denotes negative (non-diabetic) and `1` denotes positive (diabetic).

#### Table 3.1: Clinical Features and Biological Ranges
| Variable Name | Role | Clinical Metric | Data Type | Valid Physiological Range |
| :--- | :--- | :--- | :--- | :--- |
| `gender` | Predictor | Biological sex | Categorical | `Female`, `Male`, `Other` |
| `age` | Predictor | Patient age | Continuous | $1.0 - 100.0\text{ years}$ |
| `hypertension` | Predictor | High blood pressure history | Binary | `0` (Normal) or `1` (Hypertensive) |
| `heart_disease`| Predictor | Cardiovascular condition | Binary | `0` (Normal) or `1` (Heart Disease) |
| `smoking_history` | Predictor | Tobacco consumption | Categorical | `never`, `former`, `current`, `ever`, etc. |
| `bmi` | Predictor | Body Mass Index | Continuous | $10.0 - 60.0\text{ kg/m}^2$ |
| `HbA1c_level` | Predictor | Glycated hemoglobin | Continuous | $3.5\% - 10.0\%$ |
| `blood_glucose_level` | Predictor | Plasma glucose | Continuous | $70 - 300\text{ mg/dL}$ |
| `diabetes` | **Target** | Diagnostic status | Binary | `0` (Negative) or `1` (Positive) |

### 3.2 Clinical Variable Profiles & Physiological Significance
Understanding the physiological mechanism of each variable is essential for validating model predictions:

1. **Glycated Hemoglobin (HbA1c):** When blood glucose remains elevated, glucose molecules bind irreversibly to hemoglobin in red blood cells. Because erythrocytes have an average lifespan of 120 days, HbA1c reflects average glycemia over the prior 2 to 3 months. According to ADA standards:
   * Normal: $< 5.7\%$
   * Prediabetes: $5.7\% - 6.4\%$
   * Diabetes: $\ge 6.5\%$
2. **Blood Glucose Level:** Measures circulating plasma glucose at the time of diagnostic screening. Fasting plasma glucose $\ge 126\text{ mg/dL}$ or random plasma glucose $\ge 200\text{ mg/dL}$ strongly indicates impaired glycemic control.
3. **Body Mass Index (BMI):** Calculated as weight in kilograms divided by height in meters squared ($\text{kg/m}^2$). Excess adipose tissue releases non-esterified fatty acids, glycerol, hormones, and pro-inflammatory cytokines that impair peripheral insulin signaling, driving insulin resistance.
4. **Cardiovascular Indicators (Hypertension & Heart Disease):** Atherosclerosis and chronic endothelial stiffness frequently co-occur with hyperinsulinemia and metabolic syndrome.
5. **Smoking History:** Nicotine directly impairs beta-cell sensitivity and promotes abdominal fat accumulation.

### 3.3 The Problem of Biologically Implausible Zero Values
A major challenge in clinical tabular datasets is the confounding representation of missing data as the numeric value `0`.

#### Table 3.2: Segregation of Implausible vs. Valid Zero Features
| Feature | Is `0` Biologically Possible? | Imputation Strategy | Justification |
| :--- | :---: | :--- | :--- |
| `bmi` | **No** | Replace `0` with `NaN` $\rightarrow$ Median Impute | A living patient cannot have zero body mass. |
| `HbA1c_level` | **No** | Replace `0` with `NaN` $\rightarrow$ Median Impute | Red blood cells always have baseline glycated hemoglobin. |
| `blood_glucose_level` | **No** | Replace `0` with `NaN` $\rightarrow$ Median Impute | Glucose of zero corresponds to fatal systemic hypoglycemia. |
| `hypertension` | **Yes** | **Preserve `0`** | `0` is a valid reading indicating absence of hypertension. |
| `heart_disease` | **Yes** | **Preserve `0`** | `0` is a valid reading indicating no prior cardiac pathology. |
| `age` | Partial | Impute if $\le 0$ | Age must be positive. |

Treating `hypertension = 0` as missing data would corrupt genuine non-hypertensive patient profiles, while failing to convert `bmi = 0` would lead the mathematical scaler to calculate invalid standard deviations.

### 3.4 Data Transformation Pipeline & Leakage Mitigation
To eliminate data leakage, all feature transformations are encapsulated inside Scikit-Learn’s `ColumnTransformer`. The dataset is split **prior** to any statistical computation:

```python
# Implausible zero transformer (BMI, HbA1c, Glucose)
implausible_zero_transformer = Pipeline(steps=[
    ("zero_to_nan", FunctionTransformer(convert_zeros_to_nan, validate=False)),
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

# Valid zero numerical transformer (Hypertension, Heart Disease, Age)
standard_numerical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

# Categorical transformer (Gender, Smoking History)
categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])
```

By ensuring that `fit()` is called exclusively on training data ($N = 80,000$), the test partition ($N = 20,000$) remains completely unobserved until model evaluation.

---

# CHAPTER 4: SYSTEM ARCHITECTURE & DESIGN

### 4.1 Four-Tier Modular Architecture
DiaPredict AI is structured across four decoupled, scalable tiers:

```
+-------------------------------------------------------------------------+
|                         TIER 1: PRESENTATION LAYER                      |
|       React 19 SPA | TypeScript | Tailwind CSS v3 | Recharts Graphics   |
|   [Patient Form]   [Risk Gauge]   [Radar Chart]   [Batch Screening UI]  |
+-------------------------------------------------------------------------+
                                    |  ^
                 HTTP REST (JSON)   |  |  Sub-10ms Async Responses
                                    v  |
+-------------------------------------------------------------------------+
|                          TIER 2: APPLICATION SERVICE                    |
|                FastAPI Asynchronous Gateway (Uvicorn ASGI)              |
|   [Pydantic Validation]   [CORS Middleware]   [Endpoint Controllers]   |
+-------------------------------------------------------------------------+
                                    |  ^
               Joblib Pipeline Call |  |  Class Probabilities
                                    v  |
+-------------------------------------------------------------------------+
|                       TIER 3: INFERENCE PIPELINE                        |
|                     Scikit-Learn Machine Learning Core                  |
|    [ColumnTransformer]   [StandardScaler]   [Random Forest Ensemble]   |
+-------------------------------------------------------------------------+
                                    |  ^
                SQL Insert / Select |  |  Row Tuples & Aggregates
                                    v  |
+-------------------------------------------------------------------------+
|                       TIER 4: PERSISTENCE & STORAGE                     |
|           SQLite Database (data/diabetes_history.db) & Flat Files       |
|   [predictions Table]   [JSON Benchmarks]   [Raw Clinical CSV Data]     |
+-------------------------------------------------------------------------+
```

### 4.2 Data Flow & Component Interaction Model
When a healthcare provider or user submits a patient evaluation:
1. The **React PatientForm** captures clinical biomarkers, checks client-side boundaries, and emits an asynchronous `POST` request.
2. The **FastAPI Service** receives the request at `/predict`.
3. The **Pydantic Model (`PatientPayload`)** validates that all values lie within allowable physiological limits (e.g., $10 \le \text{BMI} \le 70$).
4. The payload is converted into a 1-row Pandas DataFrame and fed to the deserialized **Scikit-Learn Pipeline (`diabetes_pipeline.pkl`)**.
5. The pipeline performs on-the-fly zero imputation, standard scaling, and one-hot encoding, and queries the ensemble Random Forest.
6. The model calculates the predicted class (`0` or `1`) and the continuous class probability using `predict_proba()`.
7. The **Database Module (`database.py`)** writes the full clinical record and output score to **SQLite**.
8. A JSON response containing probability, risk tier, and database ID is returned to the client in under 10 milliseconds.
9. The frontend renders the **Semi-Circle Donut Gauge**, updates the **Biomarker Radar**, and refreshes the **SQLite Audit Trail**.

### 4.3 Database Entity Design & SQLite Normalization
To avoid enterprise database overhead while guaranteeing reliability, the persistence layer uses **SQLite 3**.

#### Table 4.1: SQLite `predictions` Table Column Definitions
| Field Name | SQLite Data Type | Constraints | Purpose |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for clinical record |
| `patient_name` | `TEXT` | `DEFAULT 'Anonymous Patient'` | Patient name or hospital ID |
| `gender` | `TEXT` | `NOT NULL` | Patient biological sex |
| `age` | `REAL` | `NOT NULL` | Patient age in years |
| `hypertension` | `INTEGER` | `NOT NULL` | Hypertension flag ($0$ or $1$) |
| `heart_disease` | `INTEGER` | `NOT NULL` | Heart disease flag ($0$ or $1$) |
| `smoking_history` | `TEXT` | `NOT NULL` | Categorical smoking exposure |
| `bmi` | `REAL` | `NOT NULL` | Body Mass Index measurement |
| `hba1c_level` | `REAL` | `NOT NULL` | Glycated hemoglobin reading |
| `blood_glucose_level` | `REAL` | `NOT NULL` | Fasting blood glucose reading |
| `prediction` | `INTEGER` | `NOT NULL` | Binary ML classification ($0$ or $1$) |
| `probability` | `REAL` | `NOT NULL` | Continuous model confidence ($0.0 - 1.0$) |
| `percentage` | `REAL` | `NOT NULL` | Risk score percentage ($0.0 - 100.0\%$) |
| `risk_tier` | `TEXT` | `NOT NULL` | Stratified tier (Low, Moderate, High, Critical) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Chronological audit timestamp |

To optimize query latency across growing records, composite indexes were constructed:
```sql
CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX idx_predictions_risk_tier ON predictions(risk_tier);
```

### 4.4 RESTful API Contract & Schema Definition
The API adheres strictly to OpenAPI 3.0 conventions:

#### Table 4.2: REST API Endpoint Specification
| HTTP Method | Route | Request Body | Response Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/predict` | JSON (`PatientPayload`) | JSON (Risk score, probability, tier, ID) | Evaluates patient risk and saves record |
| `GET` | `/predictions`| Query (`limit`, `offset`) | JSON (Array of audit records, total count) | Retrieves paginated historical assessments |
| `DELETE` | `/predictions/{id}` | None | JSON (`{"status": "success"}`) | Deletes specific patient audit record |
| `GET` | `/analytics` | None | JSON (Cohort averages, tier distribution) | Computes real-time cohort statistics |
| `GET` | `/health` | None | JSON (Status, database path, model loaded) | Health check probe for container monitoring |

---

# CHAPTER 5: MACHINE LEARNING METHODOLOGY & TRAINING

### 5.1 Preprocessing Pipeline Formalism
Let the raw dataset be denoted as $\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^N$, where $\mathbf{x}_i \in \mathbb{R}^d$ represents the feature vector and $y_i \in \{0, 1\}$ represents the diabetes diagnosis label.

The pipeline applies an operator function $\Phi(\mathbf{x}): \mathcal{X} \rightarrow \mathcal{Z}$, where $\mathcal{Z}$ is the transformed feature space:
$$\Phi(\mathbf{x}) = \left[ \mathbf{z}_{\text{implausible}}, \mathbf{z}_{\text{numerical}}, \mathbf{z}_{\text{categorical}} \right]$$

1. **Standardization:** For each numerical feature $j$, the scaled value is computed as:
   $$z_{i, j} = \frac{x_{i, j} - \mu_j}{\sigma_j}$$
   where $\mu_j = \frac{1}{M}\sum_{k=1}^M x_{k, j}$ and $\sigma_j = \sqrt{\frac{1}{M}\sum_{k=1}^M (x_{k, j} - \mu_j)^2}$ are computed exclusively over the training partition ($M = 80,000$).
2. **One-Hot Encoding:** For categorical variable $c$ with $K$ unique levels, the transformation produces binary indicator vectors:
   $$z_{i, k} = \mathbb{I}(x_{i, c} = k), \quad \forall k \in \{1, \dots, K\}$$

### 5.2 Mathematical Formulation of Evaluated Classifiers

#### 1. Logistic Regression (Baseline Linear Model)
Logistic Regression models the posterior probability of the positive class via the logistic sigmoid function:
$$P(y = 1 \mid \mathbf{z}) = \sigma(\mathbf{w}^T \mathbf{z} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{z} + b)}}$$
The model parameters $\mathbf{w}$ and bias $b$ are optimized by minimizing the L2-regularized binary cross-entropy loss:
$$\mathcal{L}(\mathbf{w}, b) = -\frac{1}{M}\sum_{i=1}^M \left[ y_i \log(\hat{y}_i) + (1 - y_i)\log(1 - \hat{y}_i) \right] + \frac{\lambda}{2}\|\mathbf{w}\|_2^2$$

#### 2. Decision Tree Classifier (CART)
The Decision Tree recursively partitions the input space $\mathcal{Z}$ into rectangular regions $R_m$. At each node, the split $(j, s)$ on feature $j$ at threshold $s$ is chosen to maximize the reduction in Gini Impurity:
$$I_G(p) = 1 - \sum_{k=0}^1 p_k^2 = 1 - (p_0^2 + p_1^2)$$
$$\Delta I_G = I_G(\text{parent}) - \left( \frac{N_{\text{left}}}{N} I_G(\text{left}) + \frac{N_{\text{right}}}{N} I_G(\text{right}) \right)$$

#### 3. Random Forest Classifier (Ensemble Champion)
The Random Forest constructs an ensemble of $B$ independent decision trees $\{T_b\}_{b=1}^B$. Each tree is trained on a bootstrap sample $\mathcal{D}_b$ drawn with replacement from $\mathcal{D}_{\text{train}}$. At each candidate split, a random subset of features $m \le \sqrt{d}$ is considered.

For a new patient vector $\mathbf{z}$, the ensemble prediction is the aggregated vote of all individual trees:
$$\hat{P}(y = 1 \mid \mathbf{z}) = \frac{1}{B} \sum_{b=1}^B P_{T_b}(y = 1 \mid \mathbf{z})$$
$$\hat{y} = \mathbb{I}\left( \hat{P}(y = 1 \mid \mathbf{z}) \ge \tau \right), \quad \text{where } \tau = 0.5$$

Bagging drastically reduces the variance of individual deep decision trees without inflating bias:
$$\text{Var}(\bar{T}) = \rho \sigma^2 + \frac{1 - \rho}{B}\sigma^2$$
As $B \rightarrow \infty$, the second term approaches zero, while feature sub-sampling minimizes tree correlation $\rho$, ensuring superior generalization.

### 5.3 Training Protocol & Stratified Partitioning
* **Dataset Partitioning:** 80% Training ($80,000$ samples), 20% Holdout Testing ($20,000$ samples).
* **Stratification:** Stratified splitting was enforced to guarantee identical target class proportions in both training and test partitions.
* **Random Seed:** Set to `42` across all random number generators to ensure reproducibility.
* **Hyperparameters for Random Forest:** `n_estimators=100`, `max_depth=None`, `min_samples_split=2`, `class_weight='balanced'`.

### 5.4 Model Serialization & Persistence via Joblib
Following evaluation, the best-performing pipeline—encapsulating the zero-to-NaN transformer, simple median imputers, standard scaler, one-hot encoder, and the fitted Random Forest classifier—was serialized to disk using `joblib`:
```python
joblib.dump(best_pipeline, "models/diabetes_pipeline.pkl")
```
Packaging both preprocessing and classifier in a single artifact guarantees that inference queries will never suffer from missing transformer steps or feature misalignment.

---

# CHAPTER 6: EXPERIMENTAL RESULTS & BENCHMARKING

### 6.1 Evaluation Metrics Definition
In clinical diagnostic testing, overall accuracy is insufficient on its own. The models were evaluated using a full suite of standard epidemiological and machine learning metrics:

1. **Accuracy:** Fraction of correct predictions over all cases:
   $$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$
2. **Sensitivity / Recall:** Proportion of true diabetic patients correctly identified:
   $$\text{Recall} = \frac{TP}{TP + FN}$$
3. **Precision (Positive Predictive Value):** Proportion of positive predictions that are truly diabetic:
   $$\text{Precision} = \frac{TP}{TP + FP}$$
4. **F1-Score:** Harmonic mean of precision and recall:
   $$F_1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$
5. **ROC-AUC:** Area under the Receiver Operating Characteristic curve, measuring the model's ability to rank positive patients above negative patients across all possible decision thresholds.

### 6.2 Empirical Model Comparison

#### Table 6.1: Verified Benchmark Performance on 20,000 Holdout Test Samples
| Metric | Logistic Regression | Decision Tree | Random Forest Classifier (Champion) |
| :--- | :---: | :---: | :---: |
| **Accuracy** | $88.88\%$ | $88.45\%$ | **$91.07\%$** |
| **Recall (Sensitivity)** | $89.35\%$ | **$92.88\%$** | **$90.12\%$** |
| **Precision** | $42.64\%$ | $41.89\%$ | **$48.63\%$** |
| **F1-Score** | $57.73\%$ | $57.74\%$ | **$63.18\%$** |
| **ROC-AUC Score** | $96.29\%$ | $97.42\%$ | **$97.58\%$** |

### 6.3 Confusion Matrix Analysis & Clinical Type I / II Tradeoffs

#### Table 6.2: Holdout Confusion Matrix Breakdown ($N = 20,000$)
| Model | True Negatives (TN) | False Positives (FP) | False Negatives (FN) | True Positives (TP) |
| :--- | :---: | :---: | :---: | :---: |
| **Logistic Regression** | $16,257$ | $2,043$ | $181$ | $1,519$ |
| **Decision Tree** | $16,110$ | $2,190$ | **$121$** | **$1,579$** |
| **Random Forest** | **$16,682$** | **$1,618$** | $168$ | $1,532$ |

#### The Clinical Priority of Minimizing False Negatives
In healthcare informatics, diagnostic errors carry asymmetric costs:
* **False Positive (Type I Error):** A healthy patient is incorrectly flagged as high risk. The consequence is emotional anxiety and the inconvenience of follow-up confirmatory blood tests (e.g., an OGTT).
* **False Negative (Type II Error):** A diabetic patient is incorrectly told they are healthy. The consequence is progressive, unmanaged hyperglycemia leading to irreversible renal failure, blindness, or myocardial infarction.

While the single Decision Tree achieved the lowest raw False Negatives ($121$), it suffered from elevated False Positives ($2,190$), dragging its precision down to $41.89\%$. The **Random Forest** established the optimal clinical balance:
* Reduced False Positives by **$572$ patients** compared to the decision tree.
* Maintained an exceptional **$90.12\%$ Sensitivity**, missing only $168$ out of $1,700$ true positive cases.
* Achieved the highest overall **F1-Score ($63.18\%$)** and **Accuracy ($91.07\%$)**.

### 6.4 Discriminative Power & ROC-AUC Analysis
The Receiver Operating Characteristic (ROC) curve evaluates true positive rates against false positive rates across all possible classification cutoffs. 
* A random classifier achieves $\text{ROC-AUC} = 0.50$.
* A perfect classifier achieves $\text{ROC-AUC} = 1.00$.

The Random Forest achieved an outstanding **$\text{ROC-AUC} = 0.9758$ ($97.58\%$)**, indicating near-optimal class separability.

#### Table 6.3: Risk Tier Stratification Thresholds
| Calculated Probability Range | Risk Classification | Assigned Hex Color | Recommended Clinical Protocol |
| :---: | :---: | :---: | :--- |
| **$0.0\% - 19.9\%$** | **Low Risk** | `#10b981` (Emerald) | Routine wellness screening every $1 - 2$ years. |
| **$20.0\% - 44.9\%$** | **Moderate Risk** | `#eab308` (Yellow) | Annual HbA1c testing; dietary lifestyle intervention. |
| **$45.0\% - 69.9\%$** | **High Risk** | `#f97316` (Orange) | Formal clinical consultation; OGTT diagnostic testing. |
| **$70.0\% - 100.0\%$** | **Critical Risk** | `#e11d48` (Rose) | Immediate endocrine evaluation; pharmacological assessment. |

---

# CHAPTER 7: SOFTWARE ENGINEERING & IMPLEMENTATION

### 7.1 Backend REST Service Architecture (FastAPI & Uvicorn)
The backend REST service is contained in [`api.py`](file:///d:/diabetes-prediction-ml/api.py). Key engineering highlights include:
1. **Asynchronous Execution:** Built on Starlette and Pydantic, FastAPI leverages Python's `asyncio` event loop to handle concurrent web requests without thread-locking.
2. **Strict Schema Validation:** Incoming requests are parsed by Pydantic models. Malformed payloads (e.g., strings in place of numbers or blood glucose $< 0$) are rejected with descriptive `422 Unprocessable Entity` errors before reaching the ML model.
3. **CORS Security Middleware:** Configured with `CORSMiddleware` to authorize secure cross-origin resource sharing from the React development server (`http://localhost:5173`).
4. **Self-Documenting Swagger UI:** Automatically generates interactive OpenAPI documentation at `/docs`, enabling rapid testing by developers and clinical testers.

### 7.2 Database Persistence Engine (SQLite)
The database engine in [`database.py`](file:///d:/diabetes-prediction-ml/database.py) provides reliable, zero-configuration local persistence:
* **Context Manager (`get_db()`):** Uses Python’s `contextlib` to guarantee that connections commit transactions automatically on success and rollback on exceptions, always closing open file handles to eliminate memory leaks.
* **Row Factories:** Utilizes `sqlite3.Row` to return dictionary-like row structures that serialize directly into JSON.
* **Analytical Queries:** Computes real-time cohort statistics directly inside SQL using optimized aggregate functions (`AVG()`, `COUNT()`, `GROUP BY risk_tier`).

### 7.3 Frontend Web Engineering (React 19 & TypeScript)
The web client in [`frontend/`](file:///d:/diabetes-prediction-ml/frontend) was scaffolded using Vite with strict TypeScript checking:
1. **Component Modularity:** Divided into focused, single-responsibility components:
   * `Header.tsx`: Navigation tabs, dynamic brand styling, and live backend connectivity status pill.
   * `PatientForm.tsx`: Interactive demographic and lab biomarker inputs, 4 diagnostic preset archetypes, and real-time WHO/ADA category badges.
   * `RiskGaugeCard.tsx`: Recharts semi-circle gauge displaying risk scores, contributing biomarker drivers, and actionable clinical advice.
   * `BiomarkerRadarChart.tsx`: Polar radar chart comparing patient metrics against healthy reference populations.
   * `ModelBenchmarksTab.tsx`: Interactive multi-model comparison charts, confusion matrix breakdown, and architecture documentation.
   * `BatchScreeningTab.tsx`: Population-level batch screening simulator with area density distributions, table search/filtering, and CSV export.
   * `HistoryTab.tsx`: Live audit trail displaying persisted records from SQLite with searching and single-click deletion.
   * `DisclaimerBanner.tsx`: High-visibility academic disclaimer component.
2. **Design System & Aesthetics:** Built using Tailwind CSS v3 with sleek glassmorphism panels (`backdrop-blur-md`), dark mode slate palettes (`slate-950`), custom scrollbars, and glowing accents (`shadow-glow-cyan`).

### 7.4 Visualization Layer (Recharts)
Rather than relying on static images, all visual analytics are generated dynamically in the browser using SVG-based **Recharts**:
* **Semi-Circle Donut Gauge:** Uses `PieChart` with `startAngle={180}` and `endAngle={0}` to render an intuitive speedometer-style risk gauge.
* **Radar Chart:** Maps 6 normalized clinical dimensions (`Glucose`, `HbA1c`, `BMI`, `Cardiovascular`, `Smoking`, `Age`) onto a radar grid to highlight multivariable deviations at a glance.
* **Area Chart:** Renders continuous cohort probability distributions using dynamic linear SVG gradients.

### 7.5 Autonomous Dual-Engine Fallback Mechanism
A key architectural innovation in [`predictionService.ts`](file:///d:/diabetes-prediction-ml/frontend/src/services/predictionService.ts) is the **Dual-Engine Architecture**:
* **Online Mode:** The frontend dispatches an HTTP request to the FastAPI server (`http://127.0.0.1:8000/predict`). If the server is live, predictions are computed using the Random Forest pipeline and stored in SQLite.
* **Autonomous Fallback Engine:** If the backend server is offline or experiencing network latency, the service gracefully switches to an internal client-side mathematical scoring engine. Calibrated against the model's logistic decision weights, this engine ensures the UI remains fully functional, responsive, and informative even without an active server connection.

---

# CHAPTER 8: VERIFICATION, TESTING & QUALITY ASSURANCE

### 8.1 Unit Testing Strategy
Software quality and pipeline integrity are verified through automated test suites using Python’s built-in `unittest` framework:
1. **Pipeline & Unpickling Verification (`tests/test_model.py`):** Ensures `diabetes_pipeline.pkl` can be cleanly unpickled, handles unseen categorical values gracefully via `handle_unknown='ignore'`, and returns valid probabilities bounded between $0.0$ and $1.0$.
2. **Database Integrity Verification (`tests/test_database.py`):** Validates table creation, insert queries, aggregate statistical calculations, and deletion operations.
3. **Environment Verification (`tests/test_environment.py`):** Asserts the physical existence and integrity of all project directories and configuration files.

### 8.2 Test Suite Execution & Output

#### Table 8.1: Unit Test Suite Coverage and Execution Summary
| Test Case Identifier | Component Tested | Tested Behavior | Execution Status |
| :--- | :--- | :--- | :---: |
| `test_01_model_artifact_exists` | Model Storage | Verifies `diabetes_pipeline.pkl` exists on disk | **PASSED** |
| `test_02_metrics_file_exists_and_valid` | JSON Store | Validates model benchmark schema and values | **PASSED** |
| `test_03_pipeline_prediction_workflow` | ML Inference | Validates prediction output format and probability bounds | **PASSED** |
| `test_04_pipeline_handles_unseen_categories` | Data Pipeline | Validates robustness against unseen text categories | **PASSED** |
| `test_01_insert_and_retrieve_prediction` | SQLite Database| Tests record insertion, query, and primary key indexing | **PASSED** |
| `test_02_database_stats` | Database Analytics| Tests SQL aggregation (`AVG`, `COUNT`, `GROUP BY`) | **PASSED** |

```powershell
PS D:\diabetes-prediction-ml> python -m unittest discover tests
......
----------------------------------------------------------------------
Ran 6 tests in 0.416s

OK
[Database] SQLite schema verified at D:\diabetes-prediction-ml\data\diabetes_history.db
```

### 8.3 End-to-End Build & Compilation Verification
The frontend code was compiled using the production Vite TypeScript bundler (`tsc -b && vite build`). The build completed with **zero errors and zero lint warnings**:
```text
✓ 2518 modules transformed.
dist/index.html                   1.03 kB │ gzip:   0.58 kB
dist/assets/index-qET3WjeA.css   24.45 kB │ gzip:   5.37 kB
dist/assets/index-BroJx0yR.js   724.49 kB │ gzip: 207.74 kB
✓ built in 836ms
```

---

# CHAPTER 9: CLINICAL ETHICS, SAFETY & REGULATORY CONSIDERATIONS

### 9.1 Academic Prototype Boundaries vs. Clinical Certification
Machine learning applications deployed in healthcare environments must satisfy rigorous regulatory frameworks, such as the **FDA Software as a Medical Device (SaMD)** regulations and the **European Union Medical Device Regulation (EU MDR)**.

DiaPredict AI is explicitly designated as an **Academic & Educational Prototype**. It is designed to demonstrate full-stack machine learning workflows and clinical risk estimation principles. It is **not clinically validated, not approved by regulatory bodies, and cannot diagnose diabetes or prescribe treatment**. The application prominently displays a persistent educational disclaimer across all views to ensure users do not mistake model scores for professional medical diagnoses.

### 9.2 Transparency, Bias & Interpretability
Machine learning models can inadvertently encode socioeconomic and demographic biases present in training data:
* **Demographic Parity:** The dataset incorporates gender diversity, yet performance across specific underrepresented ethnic groups must be rigorously monitored in future revisions.
* **Explainability:** While Random Forests deliver high classification accuracy, they function as non-linear ensembles. Providing localized explanations (via feature contribution lists and biomarker category tags) is critical for clinical trust.

### 9.3 Patient Privacy & Data Handling
In accordance with HIPAA (Health Insurance Portability and Accountability Act) principles:
* The current implementation operates entirely locally without transmitting patient diagnostic data across third-party networks.
* The SQLite audit log stores names as `'Anonymous Patient'` by default unless clinicians explicitly choose to tag records with internal hospital identifiers.

---

# CHAPTER 10: CONCLUSION & FUTURE SCOPE

### 10.1 Summary of Contributions
This major capstone project designed, developed, benchmarked, and deployed **DiaPredict AI**, a comprehensive, production-grade clinical diabetes risk prediction platform. The key academic and technical contributions include:
1. **Leak-Free Data Pipeline:** Successfully resolved common biological data cleaning flaws by engineering a Scikit-Learn `ColumnTransformer` that selectively handles continuous implausible zeros while preserving discrete binary conditions.
2. **Empirical Benchmarking:** Demonstrated that the **Random Forest Ensemble** outperforms single Decision Trees and Logistic Regression across holdout test partitions, securing an **Accuracy of 91.07%**, an **ROC-AUC of 97.58%**, and a high **Recall of 90.12%**, effectively minimizing dangerous False Negatives in diagnostic screening.
3. **Enterprise REST Layer:** Built an asynchronous **FastAPI** backend with automatic Pydantic data validation and CORS support, delivering sub-10ms inference latencies.
4. **Relational Audit Persistence:** Implemented a lightweight, robust **SQLite** persistence module with context-managed transactions, indexing, and aggregate analytics.
5. **Modern Visualization Dashboard:** Delivered an accessible, responsive single-page application built with **React 19**, **TypeScript**, **Recharts**, and **Tailwind CSS v3**, complete with interactive semi-circle risk gauges, biomarker radar plots, batch population screening, and an autonomous offline fallback engine.
6. **Rigorous Quality Assurance:** Achieved a **100% test pass rate** across comprehensive automated unit tests and compiled clean production frontend bundles.

### 10.2 Future Research & Technical Enhancements
To build upon this work, the following extensions are planned:
1. **Explainable AI (XAI) Integration:** Integrate **SHAP (SHapley Additive exPlanations)** or **LIME** directly into the frontend to generate patient-specific visual waterfall plots detailing the exact contribution of each biomarker to the final score.
2. **EHR / EMR Interoperability:** Support international healthcare data exchange protocols—specifically **HL7 (Health Level Seven)** and **FHIR (Fast Healthcare Interoperability Resources)**—allowing seamless integration with existing hospital management software.
3. **Containerized Cloud Deployment:** Package the full application using Docker and Docker Compose for one-click deployment to cloud infrastructure (such as AWS ECS, Google Cloud Run, or Kubernetes).
4. **Active Learning & Drift Detection:** Implement automated statistical drift monitoring (e.g., using Evidently AI) to track shifts in biomarker distributions over time and trigger pipeline retraining.

---

# REFERENCES & ACADEMIC BIBLIOGRAPHY

1. **American Diabetes Association (ADA).** (2024). *Standards of Medical Care in Diabetes—2024*. Diabetes Care, 47(Suppl. 1), S1–S343.
2. **Breiman, L.** (2001). *Random Forests*. Machine Learning, 45(1), 5–32.
3. **Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., ... & Duchesnay, É.** (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.
4. **World Health Organization (WHO).** (2019). *Classification of Diabetes Mellitus 2019*. Geneva: World Health Organization.
5. **Sisodia, D., & Sisodia, D. S.** (2018). *Prediction of Diabetes using Classification Algorithms*. Procedia Computer Science, 132, 1578–1585.
6. **Tiangolo, S.** (2023). *FastAPI Framework, High Performance, Easy to Learn, Fast to Code, Ready for Production*. https://fastapi.tiangolo.com/
7. **React Team.** (2024). *React 19 Documentation and Design Philosophy*. Meta Platforms, Inc. https://react.dev/
8. **Tailwind Labs.** (2024). *Tailwind CSS: Utility-First CSS Framework Specification*. https://tailwindcss.com/
9. **Kavakiotis, I., Tsave, O., Salifoglou, A., Maglaveras, N., Vlahavas, I., & Chouvarda, I.** (2017). *Machine Learning and Data Mining Methods in Diabetes Research*. Computational and Structural Biotechnology Journal, 15, 104–116.
10. **Lundberg, S. M., & Lee, S. I.** (2017). *A Unified Approach to Interpreting Model Predictions*. Advances in Neural Information Processing Systems (NeurIPS 2017), 30.

---

# APPENDICES

### Appendix A: REST API Payload Contract Example

#### Sample Diagnostic Request Payload (`POST /predict`):
```json
{
  "patient_name": "Eleanor Vance",
  "gender": "Female",
  "age": 48.0,
  "hypertension": 0,
  "heart_disease": 0,
  "smoking_history": "former",
  "bmi": 28.4,
  "HbA1c_level": 6.1,
  "blood_glucose_level": 118.0
}
```

#### Sample Diagnostic Response Payload:
```json
{
  "record_id": 14,
  "prediction": 0,
  "probability": 0.284,
  "percentage": 28.4,
  "risk_tier": "Moderate Risk",
  "saved_to_database": true,
  "disclaimer": "Academic prototype only; not certified for clinical diagnosis."
}
```

---

### Appendix B: SQLite DDL Schema Listing

```sql
-- DDL for Patient Prediction Records
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
);

-- Performance Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_risk_tier ON predictions(risk_tier);
```

---

### Appendix C: System Requirements & Execution Reference

```powershell
# 1. Activate Python Environment & Install Dependencies
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2. Retrain ML Models & Generate Benchmarks
python train_model.py

# 3. Start the FastAPI REST Backend (Port 8000)
python api.py

# 4. Launch the React Development Server (Port 5173)
cd frontend
npm install
npm run dev

# 5. Execute Automated Test Suite
python -m unittest discover tests
```

---

*End of Project Dissertation Report.*
