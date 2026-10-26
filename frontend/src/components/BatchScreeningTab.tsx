import React, { useState } from 'react';
import type { PatientData, Gender, SmokingHistory } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, Filter, Download, Shuffle, AlertCircle, CheckCircle } from 'lucide-react';

interface CohortPatient extends PatientData {
  id: string;
  name: string;
  riskScore: number;
  tier: 'Low' | 'Moderate' | 'High' | 'Critical';
}

const FIRST_NAMES = ['Elena', 'Marcus', 'Aisha', 'David', 'Chloe', 'James', 'Fatima', 'Liam', 'Sofia', 'Devon', 'Maya', 'Rajesh'];
const LAST_NAMES = ['Chen', 'Smith', 'Al-Mansoor', 'Patel', 'Garcia', 'Johnson', 'Kim', 'O’Connor', 'Mueller', 'Rossi'];

function generateSampleCohort(count = 30): CohortPatient[] {
  const cohort: CohortPatient[] = [];
  const genders: Gender[] = ['Female', 'Male'];
  const smokings: SmokingHistory[] = ['never', 'former', 'current', 'not current'];

  for (let i = 1; i <= count; i++) {
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const age = Math.floor(Math.random() * 55) + 25;
    const hypertension = Math.random() < 0.22 ? 1 : 0;
    const heart_disease = Math.random() < 0.12 ? 1 : 0;
    const smoking_history = smokings[Math.floor(Math.random() * smokings.length)];
    const bmi = parseFloat((Math.random() * 22 + 18.5).toFixed(1));
    const HbA1c_level = parseFloat((Math.random() * 4.5 + 4.5).toFixed(1));
    const blood_glucose_level = Math.floor(Math.random() * 140 + 75);

    // Rough risk score calculation
    let score = Math.floor(
      ((HbA1c_level - 4.5) / 4.5) * 45 +
      ((blood_glucose_level - 75) / 140) * 35 +
      (bmi > 30 ? 15 : 0) +
      (hypertension * 10) +
      (heart_disease * 10)
    );
    score = Math.min(Math.max(score, 4), 98);

    let tier: CohortPatient['tier'] = 'Low';
    if (score >= 70) tier = 'Critical';
    else if (score >= 45) tier = 'High';
    else if (score >= 20) tier = 'Moderate';

    cohort.push({
      id: `P-${1000 + i}`,
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3) % LAST_NAMES.length]}`,
      gender,
      age,
      hypertension,
      heart_disease,
      smoking_history,
      bmi,
      HbA1c_level,
      blood_glucose_level,
      riskScore: score,
      tier,
    });
  }

  return cohort.sort((a, b) => b.riskScore - a.riskScore);
}

export const BatchScreeningTab: React.FC = () => {
  const [cohort, setCohort] = useState<CohortPatient[]>(() => generateSampleCohort(35));
  const [filterTier, setFilterTier] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const regenerate = () => {
    setCohort(generateSampleCohort(35));
  };

  const filtered = cohort.filter((p) => {
    const matchesTier = filterTier === 'all' || p.tier.toLowerCase() === filterTier.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  // Calculate cohort distribution for Recharts
  const distributionData = [
    { range: '0-20% (Low)', count: cohort.filter((p) => p.riskScore < 20).length },
    { range: '20-45% (Moderate)', count: cohort.filter((p) => p.riskScore >= 20 && p.riskScore < 45).length },
    { range: '45-70% (High)', count: cohort.filter((p) => p.riskScore >= 45 && p.riskScore < 70).length },
    { range: '70-100% (Critical)', count: cohort.filter((p) => p.riskScore >= 70).length },
  ];

  const criticalCount = cohort.filter((p) => p.tier === 'Critical' || p.tier === 'High').length;

  const downloadCSV = () => {
    const headers = 'ID,Name,Gender,Age,Hypertension,Heart_Disease,Smoking,BMI,HbA1c,Blood_Glucose,Risk_Score,Tier\n';
    const rows = cohort
      .map(
        (p) =>
          `${p.id},"${p.name}",${p.gender},${p.age},${p.hypertension},${p.heart_disease},${p.smoking_history},${p.bmi},${p.HbA1c_level},${p.blood_glucose_level},${p.riskScore}%,${p.tier}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diabetes_screening_cohort_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Cohort Summary */}
      <div className="rounded-2xl bg-slate-900/60 p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Cohort Batch Screening & Triage</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate population risk stratification to proactively identify high-risk individuals for triage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={regenerate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Generate New Cohort
          </button>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-glow-cyan transition"
          >
            <Download className="h-3.5 w-3.5" />
            Export Triage CSV
          </button>
        </div>
      </div>

      {/* Cohort Distribution Chart */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Population Risk Stratification</h3>
            <p className="text-xs text-slate-400">Total screened: {cohort.length} patients | Identified for Triage: {criticalCount}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800 font-semibold">
            {((criticalCount / cohort.length) * 100).toFixed(0)}% High/Critical
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={distributionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="range" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="count" name="Patients" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#riskGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patients Table & Filter */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Risk Tiers</option>
              <option value="critical">Critical Risk (≥70%)</option>
              <option value="high">High Risk (45-70%)</option>
              <option value="moderate">Moderate Risk (20-45%)</option>
              <option value="low">Low Risk (&lt;20%)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age / Gender</th>
                <th className="px-4 py-3">BMI</th>
                <th className="px-4 py-3">HbA1c</th>
                <th className="px-4 py-3">Glucose</th>
                <th className="px-4 py-3">Risk Score</th>
                <th className="px-4 py-3">Triage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition font-sans">
                  <td className="px-4 py-2.5 font-mono text-cyan-400 font-medium">{p.id}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-200">{p.name}</td>
                  <td className="px-4 py-2.5 text-slate-400">{p.age} y / {p.gender}</td>
                  <td className="px-4 py-2.5 font-mono">{p.bmi}</td>
                  <td className="px-4 py-2.5 font-mono">{p.HbA1c_level}%</td>
                  <td className="px-4 py-2.5 font-mono">{p.blood_glucose_level} mg/dL</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-white">{p.riskScore}%</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        p.tier === 'Critical'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                          : p.tier === 'High'
                          ? 'bg-orange-950/60 text-orange-300 border-orange-800'
                          : p.tier === 'Moderate'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {p.tier === 'Critical' || p.tier === 'High' ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {p.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
