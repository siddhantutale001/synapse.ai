import React from 'react';
import { Lightbulb, Zap, CheckCircle2 } from 'lucide-react';

export default function InnovationGaps({ data }) {
  const gaps = data?.innovation_gaps || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Innovation Gaps</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gaps.map((gap, idx) => (
          <div
            key={idx}
            className={`ios-glass glass-shimmer p-5 rounded-3xl space-y-3 card-hover border border-amber-200 dark:border-amber-500/20 animate-slide-up ${
              idx % 2 === 1 ? 'delay-75' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Gap #{idx + 1}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{gap.gap_title}</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">{gap.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Impact: {gap.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
