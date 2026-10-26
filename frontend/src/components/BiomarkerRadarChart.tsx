import React from 'react';
import type { PatientData } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Compass } from 'lucide-react';

interface BiomarkerRadarChartProps {
  patient: PatientData;
}

export const BiomarkerRadarChart: React.FC<BiomarkerRadarChartProps> = ({ patient }) => {
  // Normalize metrics to a 0-100 index where ~50 represents the upper normal boundary
  const glucoseIndex = Math.min(Math.round((patient.blood_glucose_level / 200) * 100), 100);
  const hba1cIndex = Math.min(Math.round((patient.HbA1c_level / 9.0) * 100), 100);
  const bmiIndex = Math.min(Math.round((patient.bmi / 45) * 100), 100);
  const ageIndex = Math.min(Math.round((patient.age / 90) * 100), 100);
  const cvdIndex = (patient.hypertension * 50) + (patient.heart_disease * 50);
  const smokingIndex = patient.smoking_history === 'current' ? 90 : patient.smoking_history === 'former' ? 50 : 20;

  const data = [
    { subject: 'Blood Glucose', patient: glucoseIndex, normalRef: 50, fullMark: 100 },
    { subject: 'HbA1c Level', patient: hba1cIndex, normalRef: 55, fullMark: 100 },
    { subject: 'BMI Index', patient: bmiIndex, normalRef: 50, fullMark: 100 },
    { subject: 'Cardiovascular', patient: cvdIndex, normalRef: 10, fullMark: 100 },
    { subject: 'Smoking Exposure', patient: smokingIndex, normalRef: 20, fullMark: 100 },
    { subject: 'Age Multiplier', patient: ageIndex, normalRef: 45, fullMark: 100 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Compass className="h-4 w-4 text-cyan-400" />
          Biomarker Deviation Radar
        </h3>
        <span className="text-[11px] text-slate-400">Standardized Clinical Index</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
            <Radar
              name="Healthy Reference"
              dataKey="normalRef"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
            />
            <Radar
              name="Patient Profile"
              dataKey="patient"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cyan-400/80 inline-block shadow-glow-cyan"></span>
          <span className="text-slate-300">Patient Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500/50 inline-block"></span>
          <span className="text-slate-400">Normal Reference</span>
        </div>
      </div>
    </div>
  );
};
