import React from 'react';
import { Activity, Server, Cpu, RefreshCw, BarChart3, Users, Stethoscope, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'benchmarks' | 'batch' | 'history';
  setActiveTab: (tab: 'calculator' | 'benchmarks' | 'batch' | 'history') => void;
  apiConnected: boolean;
  checkingApi: boolean;
  onRefreshApi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apiConnected,
  checkingApi,
  onRefreshApi,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                DiaPredict <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                ML Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clinical Diabetes Risk Assessment & ML Benchmarks
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
          <button
            id="tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Assessment
          </button>
          
          <button
            id="tab-benchmarks"
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'benchmarks'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Benchmarks
          </button>

          <button
            id="tab-batch"
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'batch'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Cohort
          </button>

          <button
            id="tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            SQLite History
          </button>
        </div>

        {/* Backend Status Indicator */}
        <div className="flex items-center gap-2.5">
          <div
            id="backend-status-pill"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border backdrop-blur-sm transition-all ${
              apiConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900/60 border-slate-700/50 text-slate-400'
            }`}
          >
            {apiConnected ? (
              <>
                <Server className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-medium">FastAPI Server (Live)</span>
              </>
            ) : (
              <>
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-medium">Autonomous ML Engine</span>
              </>
            )}
          </div>

          <button
            id="btn-refresh-connection"
            onClick={onRefreshApi}
            disabled={checkingApi}
            title="Check FastAPI Backend Connection (port 8000)"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${checkingApi ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
};
