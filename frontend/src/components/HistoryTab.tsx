import React, { useState, useEffect, useCallback } from 'react';
import type { DatabaseRecord, DatabaseStats } from '../types';
import { fetchHistory, deleteHistoryRecord, fetchAnalytics } from '../services/predictionService';
import { Database, Trash2, Search, Filter, RefreshCw, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

interface HistoryTabProps {
  apiConnected: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ apiConnected }) => {
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [fetchedRecords, fetchedStats] = await Promise.all([
      fetchHistory(100),
      fetchAnalytics(),
    ]);
    setRecords(fetchedRecords);
    setStats(fetchedStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, apiConnected]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const ok = await deleteHistoryRecord(id);
    if (ok) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      const updatedStats = await fetchAnalytics();
      setStats(updatedStats);
    }
    setDeletingId(null);
  };

  const filtered = records.filter((r) => {
    const matchesTier = filterTier === 'all' || r.risk_tier.toLowerCase().includes(filterTier.toLowerCase());
    const matchesSearch =
      r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toString().includes(search);
    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">SQLite Clinical Audit Trail</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                  data/diabetes_history.db
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every clinical evaluation conducted via the FastAPI backend is automatically logged into SQLite.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh Records
          </button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      {stats && stats.total_screenings > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Total Saved In SQLite</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{stats.total_screenings}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Patient assessments</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Mean Glucose</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.averages.glucose} <span className="text-xs text-slate-400 font-normal">mg/dL</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Cohort average</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Mean HbA1c</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{stats.averages.hba1c}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Glycated hemoglobin</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Mean Risk Score</div>
            <div className="text-2xl font-bold font-mono text-teal-400 mt-1">{stats.averages.risk_percentage}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Average probability</div>
          </div>
        </div>
      )}

      {/* Records Table Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Empty state / Offline guide */}
        {records.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
            <HardDrive className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-200">No SQLite records yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Start the FastAPI backend with <code className="text-cyan-400 font-mono">python api.py</code> and submit a patient risk assessment. It will instantly persist to <code className="text-cyan-400 font-mono">data/diabetes_history.db</code>.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Age / Gender</th>
                  <th className="px-4 py-3">BMI</th>
                  <th className="px-4 py-3">HbA1c</th>
                  <th className="px-4 py-3">Glucose</th>
                  <th className="px-4 py-3">Risk Score</th>
                  <th className="px-4 py-3">Risk Tier</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50 transition font-sans">
                    <td className="px-4 py-2.5 font-mono text-cyan-400 font-semibold">#{r.id}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-200">{r.patient_name}</td>
                    <td className="px-4 py-2.5 text-slate-400">{r.age}y • {r.gender}</td>
                    <td className="px-4 py-2.5 font-mono">{r.bmi}</td>
                    <td className="px-4 py-2.5 font-mono">{r.hba1c_level}%</td>
                    <td className="px-4 py-2.5 font-mono">{r.blood_glucose_level} mg/dL</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-white">{r.percentage}%</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          r.risk_tier === 'Critical Risk'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                            : r.risk_tier === 'High Risk'
                            ? 'bg-orange-950/60 text-orange-300 border-orange-800'
                            : r.risk_tier === 'Moderate Risk'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {r.percentage >= 50 ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {r.risk_tier}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-[11px] font-mono">{r.created_at}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        title="Delete from SQLite database"
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
