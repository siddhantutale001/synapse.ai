import React from 'react';
import { Grid, ShieldCheck, XCircle } from 'lucide-react';

export default function ComparisonMatrix({ data }) {
  const matrix = data?.comparison_matrix || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Grid className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Solution Matrix</span>
        </h3>
      </div>

      <div className="overflow-x-auto rounded-3xl ios-glass overflow-hidden animate-slide-up">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3.5">Competitor</th>
              <th className="p-3.5">Approach</th>
              <th className="p-3.5">Limitations</th>
              <th className="p-3.5 text-emerald-600 dark:text-emerald-400">Our Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-200">{row.competitor}</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300">{row.approach}</td>
                <td className="p-3.5 text-rose-600 dark:text-rose-300">
                  <div className="flex items-start gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.limitations}</span>
                  </div>
                </td>
                <td className="p-3.5 text-emerald-700 dark:text-emerald-300 font-medium">
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{row.our_advantage}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
