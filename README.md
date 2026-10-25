# Diabetes Prediction System 🩺

An end-to-end Machine Learning project built with Python, scikit-learn, Pandas, NumPy, and Streamlit. This application predicts the likelihood of diabetes in patients based on clinical diagnostic measurements.

---

## 📁 Project Structure

```text
diabetes-prediction-ml/
│
├── .venv/                 # Isolated Python virtual environment
├── data/                  # Dataset storage
│   └── README.md          # Information about the PIMA diabetes dataset
├── models/                # Saved trained models & scalers (.pkl)
│   └── .gitkeep
├── tests/                 # Basic unit and environment tests
│   └── test_environment.py
├── app.py                 # Streamlit web application frontend
├── train_model.py         # Model training and evaluation pipeline
├── requirements.txt       # Project dependencies
└── README.md              # Project documentation
```

---

## 🛠️ Setup Instructions

### 1. Activate the Virtual Environment

**In PowerShell:**
```powershell
.venv\Scripts\Activate.ps1
```

**In Command Prompt (CMD):**
```cmd
.venv\Scripts\activate.bat
```

### 2. Install Required Dependencies
*(Run this inside your activated environment)*
```bash
pip install -r requirements.txt
```

### 3. Add Dataset
Place the `diabetes.csv` file inside the `data/` folder.

### 4. Train the Model
```bash
python train_model.py
```

### 5. Run the Web Application
```bash
streamlit run app.py
```

---

## 📊 Features Used in Prediction
1. **Pregnancies**: Number of times pregnant
2. **Glucose**: Plasma glucose concentration
3. **BloodPressure**: Diastolic blood pressure (mm Hg)
4. **SkinThickness**: Triceps skin fold thickness (mm)
5. **Insulin**: 2-Hour serum insulin (mu U/ml)
6. **BMI**: Body mass index (weight in kg / (height in m)²)
7. **DiabetesPedigreeFunction**: Diabetes pedigree function score
8. **Age**: Patient's age (years)
