export type Gender = 'Female' | 'Male' | 'Other';
export type SmokingHistory = 'never' | 'current' | 'former' | 'ever' | 'not current' | 'No Info';

export interface PatientData {
  patient_name?: string;
  gender: Gender;
  age: number;
  hypertension: number; // 0 or 1
  heart_disease: number; // 0 or 1
  smoking_history: SmokingHistory;
  bmi: number;
  HbA1c_level: number;
  blood_glucose_level: number;
}

export type RiskTier = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';

export interface PredictionResult {
  record_id?: number;
  probability: number; // 0.0 to 1.0
  percentage: number;  // 0 to 100
  prediction: number;  // 0 or 1
  riskTier: RiskTier;
  riskColor: string;
  contributingFactors: {
    name: string;
    impact: 'low' | 'moderate' | 'high';
    value: string;
    clinicalNote: string;
  }[];
  timestamp: string;
  source: 'api' | 'local_engine';
  saved_to_database?: boolean;
}

export interface DatabaseRecord {
  id: number;
  patient_name: string;
  gender: string;
  age: number;
  hypertension: number;
  heart_disease: number;
  smoking_history: string;
  bmi: number;
  hba1c_level: number;
  blood_glucose_level: number;
  prediction: number;
  probability: number;
  percentage: number;
  risk_tier: string;
  created_at: string;
}

export interface DatabaseStats {
  total_screenings: number;
  risk_tier_distribution: Record<string, number>;
  averages: {
    bmi: number;
    hba1c: number;
    glucose: number;
    risk_percentage: number;
  };
}

export interface MetricComparison {
  Accuracy: number;
  Precision: number;
  Recall: number;
  F1_Score: number;
  ROC_AUC: number;
  Confusion_Matrix: number[][];
}

export interface ModelComparisonData {
  disclaimer: string;
  random_seed: number;
  test_size: number;
  best_model: string;
  comparison: Record<string, MetricComparison>;
}
