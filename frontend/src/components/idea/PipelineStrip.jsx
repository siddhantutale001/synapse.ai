import React from 'react';
import { Search, Network, FolderGit2, LayoutDashboard, Bot, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function PipelineStrip() {
  const { currentScreen, setCurrentScreen } = useWorkspace();

  const steps = [
    { id: 'deepsearch', num: '01', title: 'DeepSearch', desc: 'Citations & DOIs', icon: Search },
    { id: 'clustering', num: '02', title: 'Clustering', desc: 'SOTA Gap Matrix', icon: Network },
    { id: 'projecthub', num: '03', title: 'Project HUB', desc: 'Roadmap & Stack', icon: FolderGit2 },
    { id: 'dashboard', num: '04', title: 'Dashboard', desc: 'KPI Metrics', icon: LayoutDashboard },
    { id: 'agent', num: '05', title: 'AI Agent', desc: 'Bot Nudges', icon: Bot },
  ];

  return (
    <div className="max-w-4xl mx-auto my-6">
      <div className="grid grid-cols-5 gap-2 bg-white p-2.5 rounded-2xl border border-[#E6E8F5] shadow-xs">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentScreen === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentScreen(step.id)}
              className={`p-3 rounded-xl transition text-left flex flex-col justify-between relative ${
                isActive
                  ? 'bg-[#0D0F2B] text-white shadow-md'
                  : 'bg-[#F5F6FD] text-[#5B6178] hover:bg-[#E6E8F5] hover:text-[#12162A]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#00D3A0]' : 'text-[#9198B0]'}`}>
                  {step.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5A3C]' : 'text-[#9198B0]'}`} />
              </div>
              <div className="mt-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-display font-bold text-xs">{step.title}</h5>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-[#9198B0]/60 hidden md:block" />
                  )}
                </div>
                <p className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{step.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
