import React from 'react';
import type { PatientData, Gender, SmokingHistory } from '../types';
import { Sparkles, HeartPulse, User, Flame, Scale, Droplet } from 'lucide-react';

interface PatientFormProps {
  patient: PatientData;
  setPatient: React.Dispatch<React.SetStateAction<PatientData>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const PRESETS: { label: string; description: string; data: PatientData }[] = [
  {
    label: 'Healthy Baseline',
    description: 'Normal BMI & optimal glycemic markers',
    data: {
      gender: 'Female',
      age: 26,
      hypertension: 0,
      heart_disease: 0,
      smoking_history: 'never',
      bmi: 21.8,
      HbA1c_level: 5.1,
      blood_glucose_level: 88,
    },
  },
  {
    label: 'Pre-Diabetic Profile',
    description: 'Elevated fasting glucose & border HbA1c',
    data: {
      gender: 'Male',
      age: 48,
      hypertension: 0,
      heart_disease: 0,
      smoking_history: 'former',
      bmi: 28.4,
      HbA1c_level: 6.1,
      blood_glucose_level: 118,
    },
  },
  {
    label: 'High-Risk Profile',
    description: 'Class I obesity & diabetic glucose levels',
    data: {
      gender: 'Male',
      age: 56,
      hypertension: 1,
      heart_disease: 0,
      smoking_history: 'current',
      bmi: 34.5,
      HbA1c_level: 7.2,
      blood_glucose_level: 168,
    },
  },
  {
    label: 'Cardiovascular Comorbidity',
    description: 'Hypertension + ischemic history',
    data: {
      gender: 'Female',
      age: 65,
      hypertension: 1,
      heart_disease: 1,
      smoking_history: 'former',
      bmi: 31.2,
      HbA1c_level: 6.8,
      blood_glucose_level: 154,
    },
  },
];

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  setPatient,
  onSubmit,
  loading,
}) => {
  const updateField = <K extends keyof PatientData>(field: K, value: PatientData[K]) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  // Biomarker category helpers
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-400 bg-amber-950/40 border-amber-800' };
    if (bmi < 25) return { label: 'Normal (18.5 - 24.9)', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' };
    if (bmi < 30) return { label: 'Overweight (25 - 29.9)', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800' };
    return { label: 'Obese (≥30)', color: 'text-rose-400 bg-rose-950/40 border-rose-800' };
  };

  const getHbA1cCategory = (val: number) => {
    if (val < 5.7) return { label: 'Normal (<5.7%)', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' };
    if (val < 6.5) return { label: 'Prediabetes (5.7% - 6.4%)', color: 'text-amber-400 bg-amber-950/40 border-amber-800' };
    return { label: 'Diabetic Range (≥6.5%)', color: 'text-rose-400 bg-rose-950/40 border-rose-800' };
  };

  const getGlucoseCategory = (val: number) => {
    if (val < 100) return { label: 'Normal Fasting (<100 mg/dL)', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' };
    if (val < 126) return { label: 'Impaired / Prediabetes (100 - 125)', color: 'text-amber-400 bg-amber-950/40 border-amber-800' };
    return { label: 'Diabetic Threshold (≥126 mg/dL)', color: 'text-rose-400 bg-rose-950/40 border-rose-800' };
  };

  const bmiCat = getBmiCategory(patient.bmi);
  const hba1cCat = getHbA1cCategory(patient.HbA1c_level);
  const glucoseCat = getGlucoseCategory(patient.blood_glucose_level);

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
      
      {/* Header & Preset selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            Patient Clinical Profile
          </h2>
          <span className="text-[11px] text-slate-400">Load diagnostic archetype:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPatient({ ...preset.data })}
              className="px-2.5 py-2 rounded-xl text-left bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                {preset.label}
                <Sparkles className="h-3 w-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        
        {/* Section 1: Demographics */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
          <div className="text-xs font-medium uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Demographics & Lifestyle
          </div>

          {/* Patient Name */}
          <div className="mb-4">
            <label htmlFor="input-name" className="block text-xs font-medium text-slate-300 mb-1.5">
              Patient Full Name / Record ID (Saved to SQLite)
            </label>
            <input
              id="input-name"
              type="text"
              placeholder="e.g., Sarah Connor (or leave blank for Anonymous)"
              value={patient.patient_name || ''}
              onChange={(e) => updateField('patient_name', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Gender */}
            <div>
              <label htmlFor="input-gender" className="block text-xs font-medium text-slate-300 mb-1.5">
                Biological Gender
              </label>
              <select
                id="input-gender"
                value={patient.gender}
                onChange={(e) => updateField('gender', e.target.value as Gender)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="input-age" className="text-xs font-medium text-slate-300">
                  Age (Years)
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">{patient.age}</span>
              </div>
              <input
                id="input-age"
                type="range"
                min="1"
                max="100"
                value={patient.age}
                onChange={(e) => updateField('age', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Smoking History */}
            <div>
              <label htmlFor="input-smoking" className="block text-xs font-medium text-slate-300 mb-1.5">
                Smoking History
              </label>
              <select
                id="input-smoking"
                value={patient.smoking_history}
                onChange={(e) => updateField('smoking_history', e.target.value as SmokingHistory)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="never">Never Smoked</option>
                <option value="former">Former Smoker</option>
                <option value="current">Current Smoker</option>
                <option value="ever">Ever Smoked</option>
                <option value="not current">Not Current</option>
                <option value="No Info">No Information</option>
              </select>
            </div>

          </div>
        </div>

        {/* Section 2: Clinical Comorbidities */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
          <div className="text-xs font-medium uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <HeartPulse className="h-3.5 w-3.5" />
            Cardiovascular Conditions
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Hypertension */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Hypertension</span>
                <span className="text-[11px] text-slate-500">History of high blood pressure</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="btn-hypertension-no"
                  onClick={() => updateField('hypertension', 0)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    patient.hypertension === 0
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  No (0)
                </button>
                <button
                  type="button"
                  id="btn-hypertension-yes"
                  onClick={() => updateField('hypertension', 1)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    patient.hypertension === 1
                      ? 'bg-rose-950 text-rose-300 border border-rose-600'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Yes (1)
                </button>
              </div>
            </div>

            {/* Heart Disease */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="text-sm font-medium text-slate-200 block">Heart Disease</span>
                <span className="text-[11px] text-slate-500">Coronary or ischemic condition</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="btn-heart-disease-no"
                  onClick={() => updateField('heart_disease', 0)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    patient.heart_disease === 0
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  No (0)
                </button>
                <button
                  type="button"
                  id="btn-heart-disease-yes"
                  onClick={() => updateField('heart_disease', 1)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    patient.heart_disease === 1
                      ? 'bg-rose-950 text-rose-300 border border-rose-600'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Yes (1)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Diagnostic Biomarkers */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
          <div className="text-xs font-medium uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5" />
            Diagnostic Lab Biomarkers
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* BMI */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-bmi" className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Scale className="h-3 w-3 text-cyan-400" />
                  Body Mass Index (BMI)
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">{patient.bmi.toFixed(1)}</span>
              </div>
              <input
                id="input-bmi"
                type="range"
                min="10.0"
                max="60.0"
                step="0.1"
                value={patient.bmi}
                onChange={(e) => updateField('bmi', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mb-2"
              />
              <div className={`text-[10px] px-2 py-0.5 rounded border inline-block ${bmiCat.color}`}>
                {bmiCat.label}
              </div>
            </div>

            {/* HbA1c Level */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-hba1c" className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-400" />
                  HbA1c Level (%)
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">{patient.HbA1c_level.toFixed(1)}%</span>
              </div>
              <input
                id="input-hba1c"
                type="range"
                min="3.5"
                max="10.0"
                step="0.1"
                value={patient.HbA1c_level}
                onChange={(e) => updateField('HbA1c_level', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mb-2"
              />
              <div className={`text-[10px] px-2 py-0.5 rounded border inline-block ${hba1cCat.color}`}>
                {hba1cCat.label}
              </div>
            </div>

            {/* Blood Glucose Level */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-glucose" className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Droplet className="h-3 w-3 text-rose-400" />
                  Blood Glucose (mg/dL)
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">{patient.blood_glucose_level}</span>
              </div>
              <input
                id="input-glucose"
                type="range"
                min="70"
                max="300"
                step="1"
                value={patient.blood_glucose_level}
                onChange={(e) => updateField('blood_glucose_level', parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mb-2"
              />
              <div className={`text-[10px] px-2 py-0.5 rounded border inline-block ${glucoseCat.color}`}>
                {glucoseCat.label}
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-evaluate-risk"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 shadow-glow-cyan transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Clinical Biomarkers...</span>
            </>
          ) : (
            <>
              <HeartPulse className="h-4 w-4" />
              <span>Evaluate Diabetes Risk Score</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
