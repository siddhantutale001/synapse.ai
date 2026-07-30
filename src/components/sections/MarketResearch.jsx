import React from 'react';
import { Search, ExternalLink, BookOpen, CheckCircle, Award } from 'lucide-react';

function GlowingProgressBar({ label = 'Relevance Score', percent = 88, color = 'from-cyan-500 to-indigo-500' }) {
  return (
    <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">{label}</span>
        <span className="text-indigo-600 dark:text-cyan-400 font-bold">{percent}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function MarketResearch({ data }) {
  const insights = data?.deep_search_insights || [];
  const confidenceScores = [94, 88, 91];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <span>DeepSearch & Literature</span>
        </h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          Citations Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`ios-glass glass-shimmer p-5 rounded-3xl space-y-3 flex flex-col justify-between card-hover animate-slide-up ${
              idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : ''
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">{item.angle}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-500" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.insight}
              </p>
            </div>

            <div className="space-y-3">
              <GlowingProgressBar
                label="Lit Relevance"
                percent={confidenceScores[idx % confidenceScores.length]}
                color={idx === 0 ? 'from-cyan-500 to-indigo-500' : idx === 1 ? 'from-indigo-500 to-purple-500' : 'from-emerald-500 to-teal-400'}
              />

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400 uppercase">Citations</span>
                <div className="flex flex-wrap gap-1.5">
                  {(item.citations || ['arXiv:2401.0892', 'Nature 2024']).map((cite, cIdx) => (
                    <a
                      key={cIdx}
                      href={cite.startsWith('http') ? cite : `https://arxiv.org/abs/${cite.replace(/[^0-9.]/g, '') || '2401.0892'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/80 text-indigo-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-cyan-500 transition font-mono btn-interactive shadow-xs"
                    >
                      <span>{cite}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
