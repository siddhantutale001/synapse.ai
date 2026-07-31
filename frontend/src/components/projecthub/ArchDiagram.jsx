import React from 'react';
import { ArrowRight, Smartphone, Server, Cpu } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function ArchDiagram() {
  const { activeWorkspace } = useWorkspace();
  const diagram = activeWorkspace?.projectHub?.architecture?.diagramMermaid;

  // Dynamically extract architecture stages from JSON response, fallback if unavailable
  const rawStages = activeWorkspace?.projectHub?.architecture?.architecture_stages;
  const stages = (Array.isArray(rawStages) && rawStages.length === 3)
    ? rawStages
    : [
        { stage_name: "1. Input (App)", tech_description: "RSVP & Opt-out" },
        { stage_name: "2. Predict (API)", tech_description: "Auth & Firestore" },
        { stage_name: "3. Match (ML)", tech_description: "Demand Engine" }
      ];

  const icons = [Smartphone, Server, Cpu];
  const borderColors = ['border-[#8C5CFF]/30', 'border-[#FF5A3C]/30', 'border-[#00D3A0]/30'];
  const textColors = ['text-[#8C5CFF]', 'text-[#FF5A3C]', 'text-[#00D3A0]'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6E8F5] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-bold text-base text-[#12162A]">System Flow Architecture (Input → Predict → Match)</h4>
        <span className="text-xs font-mono text-[#0F8F6B] bg-[#D9F9EE] px-2.5 py-0.5 rounded-full font-semibold">Mermaid.js Diagram Spec</span>
      </div>

      {/* System Flow 3-Box Diagram dynamically rendered from backend response */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-[#F5F6FD] p-4 rounded-xl border border-[#E6E8F5] items-center">
        {stages.slice(0, 3).map((stage, idx) => {
          const Icon = icons[idx % icons.length];
          const borderColor = borderColors[idx % borderColors.length];
          const textColor = textColors[idx % textColors.length];

          return (
            <React.Fragment key={idx}>
              <div className={`p-3.5 bg-white rounded-xl border ${borderColor} text-center space-y-1 shadow-xs md:col-span-1 min-h-[90px] flex flex-col justify-center`}>
                <Icon className={`w-5 h-5 ${textColor} mx-auto`} />
                <h5 className="font-bold text-xs text-[#12162A] line-clamp-1">{stage.stage_name}</h5>
                <p className="text-[10px] text-[#5B6178] line-clamp-2">{stage.tech_description}</p>
              </div>

              {idx < 2 && (
                <div className="hidden md:flex justify-center md:col-span-1">
                  <ArrowRight className="w-5 h-5 text-[#9198B0]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {diagram && (
        <div className="p-3.5 bg-[#0D0F2B] rounded-xl border border-[#272E63] font-mono text-[11px] text-[#00D3A0] overflow-x-auto">
          <code>{diagram}</code>
        </div>
      )}
    </div>
  );
}
