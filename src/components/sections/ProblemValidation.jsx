import React from 'react';
import { Target, AlertCircle, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';

function CircularProgressRing({ percentage = 88, color = 'stroke-indigo-600 dark:stroke-cyan-400', label = 'Validation Index' }) {
  const radius = 22;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-white/30 dark:border-slate-800/80 shadow-sm">
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
          {percentage}%
        </span>
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
          ● Validated
        </span>
      </div>
    </div>
  );
}

export default function ProblemValidation({ data }) {
  const framing = data?.problem_framing || {};

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <span>Problem Validation & Scope</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            94.8% Market Fit Confidence
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="ios-glass glass-shimmer p-5 rounded-3xl space-y-3 card-hover animate-slide-up flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Core Problem</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                High Priority
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {framing.core_problem || 'Defining primary operational bottlenecks and systemic challenges.'}
            </p>
          </div>
          <CircularProgressRing percentage={92} color="stroke-rose-500" label="Severity Score" />
        </div>

        <div className="ios-glass glass-shimmer p-5 rounded-3xl space-y-3 card-hover animate-slide-up delay-75 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>Target Users</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                Segmented
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {framing.target_users || 'Target user groups and clinical/engineering operators.'}
            </p>
          </div>
          <CircularProgressRing percentage={88} color="stroke-indigo-600 dark:stroke-cyan-400" label="Reach Index" />
        </div>

        <div className="ios-glass glass-shimmer p-5 rounded-3xl space-y-3 card-hover animate-slide-up delay-150 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Why It Matters</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                High Impact
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {framing.why_it_matters || 'Quantified efficiency gains and impact metrics.'}
            </p>
          </div>
          <CircularProgressRing percentage={96} color="stroke-emerald-500" label="ROI Multiplier" />
        </div>
      </div>
    </div>
  );
}
