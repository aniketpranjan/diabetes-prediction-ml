import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div id="educational-disclaimer" className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] block mb-1">
            ⚠️ Academic & Educational Prototype Disclaimer
          </span>
          This application is an educational prototype built to demonstrate machine learning classification workflows.
          It is <strong>not clinically validated</strong>, <strong>not certified as a medical device</strong>, and <strong>cannot diagnose diabetes</strong> or any other clinical health condition.
          Calculated probabilities reflect statistical pattern estimation only. Always consult a licensed healthcare professional for medical diagnosis and care.
        </div>
      </div>
    </div>
  );
};
