import React from 'react';
import { Layers, CheckCircle } from 'lucide-react';

export default function TechStack({ data }) {
  const stack = data?.recommended_tech_stack || {};

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Recommended Tech Stack</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="ios-glass glass-shimmer p-4 rounded-2xl space-y-1.5 card-hover animate-slide-up">
          <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-brand-400">Frontend</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{stack.frontend || 'React 18, Vite, Tailwind CSS'}</h4>
        </div>

        <div className="ios-glass glass-shimmer p-4 rounded-2xl space-y-1.5 card-hover animate-slide-up delay-75">
          <span className="text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-400">Backend & WebSockets</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{stack.backend_or_api || 'Node.js, Express, Socket.IO'}</h4>
        </div>

        <div className="ios-glass glass-shimmer p-4 rounded-2xl space-y-1.5 card-hover animate-slide-up delay-150">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Data Storage</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{stack.data_storage || 'MongoDB Atlas / In-Memory Fallback'}</h4>
        </div>

        <div className="ios-glass glass-shimmer p-4 rounded-2xl space-y-1.5 card-hover animate-slide-up delay-200">
          <span className="text-[10px] font-mono font-bold uppercase text-cyan-600 dark:text-cyan-400">AI Engines & APIs</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{stack.cloud_and_apis || 'Google Gemini 2.5 Flash, Telegram Bot API'}</h4>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2.5 shadow-sm animate-slide-up delay-300">
        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-200">Justification:</span>
          <span className="text-slate-600 dark:text-slate-400 ml-1.5">{stack.justification || 'Sub-second latency, zero-cost tier deployment, and high concurrency.'}</span>
        </div>
      </div>
    </div>
  );
}
