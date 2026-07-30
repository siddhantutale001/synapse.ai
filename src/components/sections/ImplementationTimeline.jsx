import React from 'react';
import { Clock, Calendar, CheckCircle2, Flag } from 'lucide-react';

export default function ImplementationTimeline({ data }) {
  const timeline = data?.implementation_timeline || [];
  const phaseProgress = [100, 75, 40, 15];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Implementation Timeline</span>
        </h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10 flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          4 Phases Scheduled
        </span>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-5">
        {timeline.map((item, idx) => {
          const progress = phaseProgress[idx % phaseProgress.length];
          return (
            <div key={idx} className="relative pl-6 space-y-1">
              <div className="absolute -left-[15px] top-1 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                P{idx + 1}
              </div>

              <div
                className={`ios-glass glass-shimmer p-4 rounded-2xl space-y-2.5 shadow-sm card-hover animate-slide-up ${
                  idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.phase}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                      {progress === 100 ? 'Completed' : `${progress}% Ready`}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Milestone: {item.milestone}</p>

                {/* Horizontal Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        progress === 100
                          ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                          : 'bg-gradient-to-r from-amber-500 to-indigo-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      } transition-all duration-1000 ease-out`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Deliverables: {item.deliverables}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
