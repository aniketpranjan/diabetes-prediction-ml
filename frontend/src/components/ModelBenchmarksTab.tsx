import React, { useState } from 'react';
import modelData from '../data/model_comparison.json';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Trophy, Award, CheckCircle2, Info } from 'lucide-react';

export const ModelBenchmarksTab: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Random Forest');

  const models = ['Logistic Regression', 'Decision Tree', 'Random Forest'];

  const chartData = [
    {
      metric: 'Accuracy',
      'Logistic Regression': (modelData.comparison['Logistic Regression'].Accuracy * 100).toFixed(1),
      'Decision Tree': (modelData.comparison['Decision Tree'].Accuracy * 100).toFixed(1),
      'Random Forest': (modelData.comparison['Random Forest'].Accuracy * 100).toFixed(1),
    },
    {
      metric: 'Recall (Sensitivity)',
      'Logistic Regression': (modelData.comparison['Logistic Regression'].Recall * 100).toFixed(1),
      'Decision Tree': (modelData.comparison['Decision Tree'].Recall * 100).toFixed(1),
      'Random Forest': (modelData.comparison['Random Forest'].Recall * 100).toFixed(1),
    },
    {
      metric: 'F1-Score',
      'Logistic Regression': (modelData.comparison['Logistic Regression'].F1_Score * 100).toFixed(1),
      'Decision Tree': (modelData.comparison['Decision Tree'].F1_Score * 100).toFixed(1),
      'Random Forest': (modelData.comparison['Random Forest'].F1_Score * 100).toFixed(1),
    },
    {
      metric: 'ROC-AUC',
      'Logistic Regression': (modelData.comparison['Logistic Regression'].ROC_AUC * 100).toFixed(1),
      'Decision Tree': (modelData.comparison['Decision Tree'].ROC_AUC * 100).toFixed(1),
      'Random Forest': (modelData.comparison['Random Forest'].ROC_AUC * 100).toFixed(1),
    },
    {
      metric: 'Precision',
      'Logistic Regression': (modelData.comparison['Logistic Regression'].Precision * 100).toFixed(1),
      'Decision Tree': (modelData.comparison['Decision Tree'].Precision * 100).toFixed(1),
      'Random Forest': (modelData.comparison['Random Forest'].Precision * 100).toFixed(1),
    },
  ];

  const currentMetrics = modelData.comparison[selectedModel as keyof typeof modelData.comparison];
  const cm = currentMetrics.Confusion_Matrix;
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const tp = cm[1][1];
  const total = tn + fp + fn + tp;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Champion Model */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-teal-950/60 p-6 border border-cyan-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-glow-cyan flex items-center justify-center flex-shrink-0">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Production Pipeline</span>
              <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded-full font-bold">
                Champion Model
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Random Forest Classifier (Ensemble)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated on 20,000 stratified holdout samples. Achieved highest ROC-AUC (0.976) and top overall F1-Score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] uppercase text-slate-400">ROC-AUC</div>
            <div className="text-lg font-bold text-cyan-400 font-mono">97.6%</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] uppercase text-slate-400">Recall</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">90.1%</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] uppercase text-slate-400">Accuracy</div>
            <div className="text-lg font-bold text-teal-400 font-mono">91.1%</div>
          </div>
        </div>
      </div>

      {/* Main Benchmark Chart */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              Comparative Metric Matrix (%)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side performance comparison on identical test data
            </p>
          </div>

          {/* Model Switcher for Confusion Matrix */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {models.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedModel === m
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts BarChart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Logistic Regression" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Decision Tree" fill="#0284c7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Random Forest" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Deep Dive: Confusion Matrix & Diagnostic Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix Visual Card */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">
              Confusion Matrix: <span className="text-cyan-400">{selectedModel}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">N = {total.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            
            {/* True Negative */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                True Negatives (TN)
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {tn.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Correctly identified non-diabetic
              </div>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                False Positives (FP)
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {fp.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Type I Error (False alarms)
              </div>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                False Negatives (FN)
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {fn.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Type II Error (Missed cases)
              </div>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                True Positives (TP)
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {tp.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Correctly identified diabetic
              </div>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Significance of High Recall ({ (currentMetrics.Recall * 100).toFixed(1) }%):</strong> In medical screening, minimizing False Negatives (FN) is paramount to prevent undetected progressive diabetic complications.
            </span>
          </div>
        </div>

        {/* Pipeline & Methodology Spec */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-3">
              Standardized Pipeline Architecture
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-100 block">Selective Zero Replacement</span>
                  Preserved valid 0s (hypertension, heart disease) while replacing biologically implausible 0s (BMI, Glucose, HbA1c) with NaNs before median imputation.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-100 block">Strict Data Leakage Prevention</span>
                  ColumnTransformer and scalers were fit strictly on the training partition; test split was held out.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-100 block">Class Imbalance Handling</span>
                  Stratified split and class weighting ensured high sensitivity despite the standard diabetes class skew in clinical data.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Model Artifact: <code>diabetes_pipeline.pkl</code></span>
            <span>Seed: 42 | Split: 80/20</span>
          </div>
        </div>

      </div>

    </div>
  );
};
