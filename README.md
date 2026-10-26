# Diabetes Prediction System 🩺

An end-to-end Machine Learning project built with Python, scikit-learn, Pandas, NumPy, and Streamlit. This application predicts the likelihood of diabetes in patients based on clinical diagnostic measurements.

---

## 📁 Project Structure

```text
diabetes-prediction-ml/
│
├── .venv/                 # Isolated Python virtual environment
├── data/                  # Dataset storage
│   └── README.md          # Dataset information
├── models/                # Saved models & metrics (.pkl, .json)
│   ├── diabetes_pipeline.pkl
│   └── model_comparison.json
├── frontend/              # Modern React + TypeScript + Recharts + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/    # Recharts gauges, radar charts, benchmarks, forms
│   │   ├── services/      # API connector & autonomous ML engine
│   │   └── types/         # TypeScript clinical interfaces
│   ├── tailwind.config.js
│   └── package.json
├── tests/                 # Unit tests
│   ├── test_model.py
│   └── test_environment.py
├── api.py                 # FastAPI REST API backend (serves Scikit-Learn pipeline)
├── app.py                 # Streamlit web application frontend (alternative)
├── train_model.py         # Model training & comparison pipeline
├── requirements.txt       # Python dependencies (Scikit-Learn, FastAPI, Streamlit)
└── README.md              # Project documentation
```

---

## 🛠️ How to Run

### Option 1: Modern React + TypeScript Frontend (Recommended) 🚀

#### Step 1: Start the React Frontend
Open a terminal in the root directory:
```powershell
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

*(Note: The React frontend has a built-in autonomous clinical ML engine, so it works immediately even before the backend is running!)*

#### Step 2 (Optional): Start the FastAPI Backend
In a second terminal window (in the project root), activate the Python environment and run:
```powershell
.venv\Scripts\Activate.ps1
python api.py
```
* The API runs at **http://127.0.0.1:8000**
* Interactive Swagger Docs: **http://127.0.0.1:8000/docs**
* The React frontend will automatically detect the FastAPI backend and switch the status pill to **"FastAPI Server (Live)"**.

---

### Option 2: Original Streamlit Dashboard
If you want to run the original Streamlit application:
```powershell
.venv\Scripts\Activate.ps1
streamlit run app.py
```
Open **http://localhost:8501** in your browser.

---

### Option 3: Train or Re-evaluate ML Models
To train the models from scratch and regenerate `models/diabetes_pipeline.pkl` and `models/model_comparison.json`:
```powershell
.venv\Scripts\Activate.ps1
python train_model.py
```

---

## 📊 Features Used in Prediction
1. **Gender**: Biological sex (`Female`, `Male`, `Other`)
2. **Age**: Patient's age in years (1 to 100)
3. **Hypertension**: High blood pressure clinical indicator (`0` = No, `1` = Yes)
4. **Heart Disease**: History of coronary/cardiovascular condition (`0` = No, `1` = Yes)
5. **Smoking History**: Tobacco exposure (`never`, `former`, `current`, `ever`, `not current`, `No Info`)
6. **BMI (Body Mass Index)**: Weight-to-height ratio in kg/m²
7. **HbA1c Level**: Glycated hemoglobin percentage (%) — standard diabetes marker
8. **Blood Glucose Level**: Plasma blood glucose concentration (mg/dL)

