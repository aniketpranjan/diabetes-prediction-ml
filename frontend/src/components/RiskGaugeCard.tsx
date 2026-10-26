import React from 'react';
import type { PredictionResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle2, ChevronRight, Activity, Clock } from 'lucide-react';

interface RiskGaugeCardProps {
  result: PredictionResult;
}

export const RiskGaugeCard: React.FC<RiskGaugeCardProps> = ({ result }) => {
  const percentage = result.percentage;
  const remaining = 100 - percentage;

  const gaugeData = [
    { name: 'Risk', value: percentage },
    { name: 'Remaining', value: remaining },
  ];

  const getRiskRecommendations = (tier: string) => {
    switch (tier) {
      case 'Critical Risk':
      case 'High Risk':
        return [
          'Immediate comprehensive metabolic panel (CMP) & confirmatory venous plasma glucose test.',
          'Schedule formal clinical consultation with an endocrinologist or primary care physician.',
          'Initiate therapeutic lifestyle intervention (nutritional counseling & supervised physical activity).',
        ];
      case 'Moderate Risk':
        return [
          'Annual HbA1c surveillance and lifestyle risk monitoring.',
          'Adopt Mediterranean or low-glycemic dietary regimen.',
          'Target 150 minutes of moderate-intensity aerobic exercise per week.',
        ];
      default:
        return [
          'Biomarkers remain in optimal physiological limits.',
          'Maintain balanced nutrition and regular physical activity.',
          'Routine clinical wellness checkups every 1–2 years.',
        ];
    }
  };

  const recommendations = getRiskRecommendations(result.riskTier);

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Clinical Risk Estimation</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{result.timestamp}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400/90 font-mono">
              {result.source === 'api' ? 'FastAPI' : 'Local Pipeline'}
            </span>
          </div>
        </div>

        {/* Recharts Semi-Circle Gauge */}
        <div className="relative h-48 w-full flex items-center justify-center -my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="78%"
                startAngle={180}
                endAngle={0}
                innerRadius="72%"
                outerRadius="95%"
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell key="risk" fill={result.riskColor} />
                <Cell key="remaining" fill="#1e293b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Score */}
          <div className="absolute top-[52%] flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              {percentage}%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Estimated Risk Score
            </span>
          </div>
        </div>

        {/* Risk Tier Badge */}
        <div className="flex justify-center -mt-2 mb-5">
          <div
            id="result-risk-tier"
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md flex items-center gap-2"
            style={{
              backgroundColor: `${result.riskColor}15`,
              borderColor: `${result.riskColor}40`,
              color: result.riskColor,
            }}
          >
            {percentage >= 50 ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            {result.riskTier}
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Key Diagnostic Biomarker Drivers
          </h4>
          <div className="space-y-2">
            {result.contributingFactors.map((factor, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-medium text-slate-200 flex items-center gap-1.5">
                    <span>{factor.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({factor.value})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {factor.clinicalNote}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    factor.impact === 'high'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                      : factor.impact === 'moderate'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {factor.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Guidance Recommendations */}
      <div className="pt-4 border-t border-slate-800/80 bg-slate-900/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
          Clinical Action Guidelines
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
