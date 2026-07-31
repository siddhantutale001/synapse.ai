import React from 'react';
import { CheckCircle2, Clock, Circle, FolderGit2 } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function MilestoneTimeline() {
  const { activeWorkspace, updateMilestone } = useWorkspace();
  const milestones = activeWorkspace?.projectHub?.milestones || [];

  const completedCount = milestones.filter(m => m.status === 'COMPLETED').length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6E8F5] space-y-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-base text-[#12162A] flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-[#0F8F6B]" />
            <span>Interactive Execution Roadmap</span>
          </h4>
          <p className="text-xs text-[#5B6178]">Click status dropdown to update milestone state</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[#0F8F6B]">{completedCount} / {milestones.length} Done</span>
          <div className="w-32 bg-[#F5F6FD] h-2 rounded-full overflow-hidden mt-1 border border-[#E6E8F5]">
            <div className="bg-gradient-to-r from-[#00D3A0] to-[#8C5CFF] h-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {milestones.map((m, idx) => (
          <div 
            key={m.id} 
            className="bg-[#F5F6FD] p-4 rounded-xl border border-[#E6E8F5] flex items-center justify-between hover:border-[#8C5CFF]/40 transition"
          >
            <div className="flex items-center space-x-3.5">
              {m.status === 'COMPLETED' ? (
                <CheckCircle2 className="w-5 h-5 text-[#00D3A0] flex-shrink-0" />
              ) : m.status === 'IN_PROGRESS' ? (
                <Clock className="w-5 h-5 text-[#FF5A3C] animate-pulse flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-[#9198B0] flex-shrink-0" />
              )}

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-[#FF5A3C] bg-[#FFE3DA] px-2 py-0.5 rounded uppercase">
                    Week {idx + 1}
                  </span>
                  <h5 className="font-display font-bold text-sm text-[#12162A]">{m.title}</h5>
                </div>
                <span className="text-[11px] text-[#9198B0] font-mono mt-0.5 block">{m.duration}</span>
              </div>
            </div>

            <select
              value={m.status}
              onChange={(e) => updateMilestone(m.id, e.target.value)}
              className="bg-white border border-[#E6E8F5] text-xs font-semibold text-[#12162A] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#00D3A0] transition shadow-xs cursor-pointer"
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
