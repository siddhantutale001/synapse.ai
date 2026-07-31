import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function Topbar() {
  const { currentScreen } = useWorkspace();

  const titles = {
    idea: { title: 'Idea Studio', subtitle: 'Turn one-line student concepts into multi-layered research roadmaps' },
    deepsearch: { title: 'DeepSearch Intelligence', subtitle: 'Verifiable paper citations, arXiv DOIs & open datasets' },
    clustering: { title: 'Knowledge Clustering', subtitle: 'State-of-the-Art matrix & innovation gap analysis' },
    projecthub: { title: 'Project HUB Roadmap', subtitle: 'Mermaid system architecture, tech stack & milestone tracker' },
    dashboard: { title: 'Executive Dashboard KPI', subtitle: 'Progress metrics, active citations & pipeline execution feed' },
    agent: { title: 'Companion Bot Studio', subtitle: 'Telegram Companion Bot nudge alerts & automated Q&A' }
  };

  const currentInfo = titles[currentScreen] || titles.idea;

  return (
    <header className="h-16 bg-white/80 border-b border-[#E6E8F5] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      <div>
        <h2 className="font-display font-bold text-base text-[#12162A] tracking-tight">{currentInfo.title}</h2>
        <p className="text-xs text-[#5B6178]">{currentInfo.subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Live Web Intelligence Badge */}
        <div className="flex items-center space-x-2 bg-[#D9F9EE] text-[#00D3A0] px-3 py-1 rounded-full border border-[#00D3A0]/30 shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D3A0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D3A0]"></span>
          </span>
          <span className="text-[11px] font-mono font-semibold">Live Web Intelligence</span>
        </div>

      </div>
    </header>
  );
}
