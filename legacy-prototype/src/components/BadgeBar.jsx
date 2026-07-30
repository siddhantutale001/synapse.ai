import React from 'react';
import { Search, FolderKanban, Bot, Globe, LayoutDashboard, Brain, Users, Languages } from 'lucide-react';

const badges = [
  { label: 'DeepSearch Engine', icon: Search },
  { label: 'Project HUB', icon: FolderKanban },
  { label: 'AI Agent Companion', icon: Bot },
  { label: 'Web Intelligence', icon: Globe },
  { label: 'Dashboards', icon: LayoutDashboard },
  { label: 'Knowledge Clustering', icon: Brain },
  { label: 'Multi-User Rooms', icon: Users },
  { label: 'Multilingual (5)', icon: Languages },
];

export default function BadgeBar() {
  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-4 py-1.5 text-xs overflow-x-auto scrollbar-none no-print backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-max">
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-500 dark:text-slate-400 mr-2 text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
          <span>SYSTEM ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-[11px]"
              >
                <Icon className="w-3 h-3 text-indigo-600 dark:text-cyan-400" />
                <span className="font-medium">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
