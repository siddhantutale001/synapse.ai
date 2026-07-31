import React from 'react';
import { Network, Layers } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function ClusterBoard() {
  const { activeWorkspace } = useWorkspace();
  const clustering = activeWorkspace?.clustering;

  const categories = clustering?.existingSolutions || [
    { category: "Manual Log Systems", description: "Paper rosters & Google Sheets logging by mess staff." },
    { category: "Static Meal Prep", description: "Fixed daily prep quantities calculated on max hostel capacity." },
    { category: "End-of-day NGO Donation", description: "Post-waste surplus pickup without dynamic kitchen prep prevention." },
    { category: "Basic RSVP Mobile Apps", description: "Basic opt-in/opt-out forms lacking predictive machine learning." }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-[#12162A] flex items-center space-x-2">
          <Network className="w-5 h-5 text-[#8C5CFF]" />
          <span>Existing Solution Matrix (State-of-the-Art)</span>
        </h3>
        <span className="text-xs font-mono text-[#9198B0]">4 Grouped Categories</span>
      </div>

      {/* 2x2 Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="bg-white p-5 rounded-2xl border border-[#E6E8F5] hover:border-[#8C5CFF]/40 transition shadow-xs space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#0F8F6B] bg-[#D9F9EE] px-2.5 py-0.5 rounded-full border border-[#0F8F6B]/20">
                CATEGORY 0{i + 1}
              </span>
              <Layers className="w-4 h-4 text-[#9198B0]" />
            </div>

            <h4 className="font-display font-bold text-base text-[#12162A]">{cat.category}</h4>
            <p className="text-xs text-[#5B6178] leading-relaxed">{cat.description}</p>
            
            {/* Soft solution pill tag */}
            <div className="pt-1">
              <span className="inline-block bg-[#F5F6FD] border border-[#E6E8F5] text-[#12162A] px-3 py-1 rounded-full text-[11.5px] font-semibold">
                SOTA Matrix Component
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
