import React from 'react';
import { Layers, Code2, Server, Database, Bot } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function TechStackGrid() {
  const { activeWorkspace } = useWorkspace();
  const stack = activeWorkspace?.projectHub?.recommendedTechStack || {
    frontend: ["React 18", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "Clerk Auth"],
    database: ["Cloud Firestore", "MongoDB"],
    aiEngine: ["Python FastAPI", "LangChain"],
    bots: ["Telegram Bot API"]
  };

  const getTechColor = (techName) => {
    const lower = techName.toLowerCase();
    if (lower.includes('react')) return '#61DAFB';
    if (lower.includes('node') || lower.includes('express')) return '#8CC84B';
    if (lower.includes('python') || lower.includes('langchain')) return '#7B6CFF';
    if (lower.includes('firestore') || lower.includes('mongo') || lower.includes('database')) return '#28C79A';
    if (lower.includes('telegram') || lower.includes('bot')) return '#FF5A3C';
    return '#8C5CFF';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6E8F5] space-y-4 shadow-xs">
      <h4 className="font-display font-bold text-base text-[#12162A] flex items-center space-x-2">
        <Layers className="w-4 h-4 text-[#FF5A3C]" />
        <span>Recommended Production Tech Stack</span>
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#F5F6FD] p-3.5 rounded-xl border border-[#E6E8F5] space-y-2">
          <div className="flex items-center space-x-1.5 text-[#FF5A3C] text-xs font-mono font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Frontend</span>
          </div>
          <div className="space-y-1.5">
            {stack.frontend?.map((t, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getTechColor(t) }} />
                <span className="text-xs font-semibold text-[#12162A]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F6FD] p-3.5 rounded-xl border border-[#E6E8F5] space-y-2">
          <div className="flex items-center space-x-1.5 text-[#8C5CFF] text-xs font-mono font-semibold">
            <Server className="w-3.5 h-3.5" />
            <span>Backend</span>
          </div>
          <div className="space-y-1.5">
            {stack.backend?.map((t, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getTechColor(t) }} />
                <span className="text-xs font-semibold text-[#12162A]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F6FD] p-3.5 rounded-xl border border-[#E6E8F5] space-y-2">
          <div className="flex items-center space-x-1.5 text-[#0F8F6B] text-xs font-mono font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Database</span>
          </div>
          <div className="space-y-1.5">
            {stack.database?.map((t, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getTechColor(t) }} />
                <span className="text-xs font-semibold text-[#12162A]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F6FD] p-3.5 rounded-xl border border-[#E6E8F5] space-y-2">
          <div className="flex items-center space-x-1.5 text-[#FF5A3C] text-xs font-mono font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>AI & Bots</span>
          </div>
          <div className="space-y-1.5">
            {stack.bots?.map((t, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getTechColor(t) }} />
                <span className="text-xs font-semibold text-[#12162A]">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
