import React from 'react';
import { Cpu, Server, Database, Globe, ArrowRight } from 'lucide-react';

export default function ProjectArchitecture({ data }) {
  const arch = data?.project_architecture || {};
  const layers = arch.layers || [
    { name: "Presentation Layer", components: "React 18, Vite, Tailwind CSS", protocol: "Client Render" },
    { name: "Real-Time Gateway", components: "Node.js Express + Socket.IO Server", protocol: "WSS / HTTP" },
    { name: "AI Inference Engine", components: "Google Gemini 2.5 Flash API + Grounding", protocol: "REST JSON" },
    { name: "Storage Layer", components: "MongoDB / Local In-Memory Fallback", protocol: "Mongoose Protocol" }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <span>Project Architecture</span>
        </h3>
      </div>

      <div className="ios-glass glass-shimmer p-5 rounded-3xl space-y-4 animate-slide-up">
        <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-center text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-brand-500/30 text-indigo-700 dark:text-brand-300 font-bold space-y-1 shadow-sm">
            <Globe className="w-5 h-5 mx-auto text-indigo-600 dark:text-brand-400" />
            <div>React 18 Client</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal font-mono">Vite + Tailwind</div>
          </div>

          <div className="hidden sm:flex items-center justify-center text-slate-400">
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold space-y-1 shadow-sm">
            <Server className="w-5 h-5 mx-auto text-purple-600 dark:text-purple-400" />
            <div>Express Gateway</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal font-mono">Socket.IO Server</div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold space-y-1 shadow-sm">
            <Database className="w-5 h-5 mx-auto text-emerald-600 dark:text-emerald-400" />
            <div>Database Engine</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal font-mono">Mongo / Fallback</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {layers.map((layer, idx) => (
          <div
            key={idx}
            className={`ios-glass glass-shimmer p-4 rounded-2xl flex items-start justify-between text-xs space-y-1 card-hover animate-slide-up ${
              idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
            }`}
          >
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Layer 0{idx + 1}</span>
              <h5 className="font-bold text-slate-900 dark:text-slate-200 text-sm">{layer.name}</h5>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">{layer.components}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 font-mono">
              {layer.protocol}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
