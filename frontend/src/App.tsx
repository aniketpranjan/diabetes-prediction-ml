import React, { useState, useEffect, useCallback } from 'react';
import type { PatientData, PredictionResult } from './types';
import { predictDiabetesRisk, checkApiHealth } from './services/predictionService';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { PatientForm, PRESETS } from './components/PatientForm';
import { RiskGaugeCard } from './components/RiskGaugeCard';
import { BiomarkerRadarChart } from './components/BiomarkerRadarChart';
import { ModelBenchmarksTab } from './components/ModelBenchmarksTab';
import { BatchScreeningTab } from './components/BatchScreeningTab';
import { HistoryTab } from './components/HistoryTab';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'benchmarks' | 'batch' | 'history'>('calculator');
  const [patient, setPatient] = useState<PatientData>(PRESETS[1].data); // Start with Pre-Diabetic profile
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [checkingApi, setCheckingApi] = useState<boolean>(false);

  const checkConnection = useCallback(async () => {
    setCheckingApi(true);
    const ok = await checkApiHealth();
    setApiConnected(ok);
    setCheckingApi(false);
  }, []);

  const runPrediction = useCallback(async (data: PatientData) => {
    setLoading(true);
    const result = await predictDiabetesRisk(data);
    setPrediction(result);
    setLoading(false);
  }, []);

  // Initial setup: check backend and run default prediction
  useEffect(() => {
    checkConnection();
    runPrediction(PRESETS[1].data);
  }, [checkConnection, runPrediction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runPrediction(patient);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiConnected={apiConnected}
        checkingApi={checkingApi}
        onRefreshApi={checkConnection}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Mandatory Academic Disclaimer */}
        <DisclaimerBanner />

        {/* Tab 1: Single Patient Risk Assessment */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Input Form (7 cols on large screens) */}
              <div className="lg:col-span-7">
                <PatientForm
                  patient={patient}
                  setPatient={setPatient}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </div>

              {/* Right Column: Prediction Score & Radar Chart (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {prediction && (
                  <>
                    <RiskGaugeCard result={prediction} />
                    <BiomarkerRadarChart patient={patient} />
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Model Benchmarks & Confusion Matrix */}
        {activeTab === 'benchmarks' && <ModelBenchmarksTab />}

        {/* Tab 3: Batch Screening & Population Triage */}
        {activeTab === 'batch' && <BatchScreeningTab />}

        {/* Tab 4: SQLite Patient Audit Trail */}
        {activeTab === 'history' && <HistoryTab apiConnected={apiConnected} />}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 mt-12 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-400">
              DiaPredict AI — Machine Learning Healthcare Demonstration
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              React 19 • TypeScript • Recharts • Tailwind CSS v3 • Scikit-Learn
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            PIMA & Medical Diabetes Prediction Pipeline • Academic Prototype
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
