import React from 'react';
import { Bookmark, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function WorkspaceSideCard() {
  const { activeWorkspace } = useWorkspace();
  const ds = activeWorkspace?.deepsearch;

  return (
    <div className="space-y-4">
      {/* Problem Validation Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#FF5A3C]/30 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-[#FF5A3C] uppercase tracking-wider">Problem Validation</span>
          <span className="text-xs font-mono font-bold text-[#0F8F6B] bg-[#D9F9EE] px-2 py-0.5 rounded border border-[#0F8F6B]/20">
            {ds?.problemValidation?.severityScore || 8.5} / 10.0
          </span>
        </div>
        <p className="text-xs text-[#5B6178] leading-relaxed">
          {ds?.problemValidation?.summary || 'Validating problem urgency via arXiv papers and university dining hall reports...'}
        </p>
      </div>

      {/* Saved Citations List */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6E8F5] shadow-xs space-y-3">
        <h4 className="text-xs font-display font-bold text-[#12162A] flex items-center space-x-1.5">
          <Bookmark className="w-4 h-4 text-[#8C5CFF]" />
          <span>Saved Research Citations</span>
        </h4>

        <div className="space-y-2">
          {ds?.citations?.slice(0, 3).map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="block p-2.5 rounded-xl bg-[#F5F6FD] hover:bg-[#E6E8F5]/60 border border-[#E6E8F5] transition group"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-[#12162A] line-clamp-1 group-hover:text-[#FF5A3C] transition">{c.title}</h5>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9198B0] group-hover:text-[#FF5A3C] transition flex-shrink-0" />
              </div>
              <span className="text-[10px] text-[#9198B0] font-mono">{c.source}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
