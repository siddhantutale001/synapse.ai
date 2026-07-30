import React from 'react';
import { Database, ExternalLink, Globe } from 'lucide-react';

export default function APIsAndDatasets({ data }) {
  const items = data?.apis_and_datasets || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>APIs & Datasets</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`ios-glass glass-shimmer p-4 rounded-2xl space-y-2 flex flex-col justify-between shadow-sm card-hover animate-slide-up ${
              idx % 2 === 1 ? 'delay-75' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.name}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  item.type === 'Dataset' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' : 'bg-indigo-100 dark:bg-cyan-500/20 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-500/30'
                }`}>
                  {item.type} • {item.provider}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 relative z-10">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition"
              >
                <Globe className="w-3 h-3" />
                <span>Explore Data</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
