import React from 'react';
import { Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function InnovationGapCard() {
  const { activeWorkspace } = useWorkspace();
  const clustering = activeWorkspace?.clustering;

  return (
    <div className="space-y-4">
      {/* Full-width Dark Gradient Card */}
      <div 
        className="p-6 rounded-2xl border border-[#FF5A3C]/40 shadow-xl space-y-4 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg, #0D0F2B 0%, #2A1F66 100%)' }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#FF5A3C]/20 text-[#FF5A3C] border border-[#FF5A3C]/30 shadow-sm">
            <Zap className="w-5 h-5 text-[#FF5A3C]" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-white">Innovation Gap & Market Opening Detected</h3>
            <p className="text-xs text-[#9198B0]">Automated iNSIGHTS Layer 2 Gap Analysis</p>
          </div>
        </div>

        <div className="space-y-2 bg-[#0D0F2B]/70 p-4 rounded-xl border border-[#272E63]">
          <h4 className="text-xs font-mono font-bold text-[#FF5A3C] uppercase tracking-wider">Identified Technical Gaps:</h4>
          <ul className="space-y-2">
            {clustering?.researchGaps?.map((gap, i) => (
              <li key={i} className="text-xs text-white flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF5A3C] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 bg-[#0D0F2B]/70 p-4 rounded-xl border border-[#272E63]">
          <h4 className="text-xs font-mono font-bold text-[#00D3A0] uppercase tracking-wider">High-Impact Opportunities:</h4>
          <ul className="space-y-2">
            {clustering?.innovationOpportunities?.map((opp, i) => (
              <li key={i} className="text-xs text-white flex items-start space-x-2">
                <Lightbulb className="w-3.5 h-3.5 text-[#00D3A0] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
