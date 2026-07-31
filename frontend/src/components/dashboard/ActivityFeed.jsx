import React from 'react';
import { Activity, CheckCircle2, Search, Cpu, Bot } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function ActivityFeed() {
  const { activeWorkspace } = useWorkspace();

  const logs = [
    { id: 1, time: '10 mins ago', text: `DeepSearch verified academic papers for "${activeWorkspace?.title || 'AI Research Project'}"`, icon: Search, color: 'text-[#8C5CFF]' },
    { id: 2, time: '25 mins ago', text: 'Knowledge Clustering grouped 4 existing solution categories and identified 2 research gaps', icon: Cpu, color: 'text-[#FF5A3C]' },
    { id: 3, time: '1 hour ago', text: 'Project HUB generated Mermaid system architecture diagram and recommended tech stack', icon: CheckCircle2, color: 'text-[#0F8F6B]' },
    { id: 4, time: '2 hours ago', text: 'Telegram Companion Bot dispatched milestone nudge reminder to student chat', icon: Bot, color: 'text-[#0F8F6B]' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6E8F5] space-y-4 shadow-xs">
      <h4 className="font-display font-bold text-base text-[#12162A] flex items-center space-x-2">
        <Activity className="w-5 h-5 text-[#FF5A3C]" />
        <span>iNSIGHTS Pipeline Execution Log</span>
      </h4>

      <div className="space-y-3">
        {logs.map((log) => {
          const Icon = log.icon;
          return (
            <div key={log.id} className="bg-[#F5F6FD] p-3.5 rounded-xl border border-[#E6E8F5] flex items-start space-x-3">
              <Icon className={`w-4 h-4 ${log.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="text-xs text-[#12162A] leading-snug">{log.text}</p>
                <span className="text-[10px] text-[#9198B0] font-mono mt-1 block">{log.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
