import React from 'react';
import { Award, CheckCircle2, BookOpen, Cpu } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function StatCardRow() {
  const { activeWorkspace } = useWorkspace();
  const milestones = activeWorkspace?.projectHub?.milestones || [];
  const completedCount = milestones.filter(m => m.status === 'COMPLETED').length;
  const citationsCount = activeWorkspace?.deepsearch?.citations?.length || 4;

  const stats = [
    { label: 'Research Progress', value: '85%', sub: 'DeepSearch & Clustering', icon: Award, color: '#FF5A3C' },
    { label: 'Milestones Completed', value: `${completedCount}/${milestones.length || 4}`, sub: 'Roadmap Execution', icon: CheckCircle2, color: '#0F8F6B' },
    { label: 'Sources & DOIs', value: `${citationsCount}`, sub: 'Verifiable Citations', icon: BookOpen, color: '#8C5CFF' },
    { label: 'L2 Capabilities Used', value: '4 / 4', sub: 'Pipeline Active', icon: Cpu, color: '#0F8F6B' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#E6E8F5] shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#9198B0] uppercase tracking-wider">{s.label}</span>
              <Icon className="w-4 h-4" style={{ color: s.color }} />
            </div>

            <div className="text-3xl font-display font-extrabold text-[#12162A] tracking-tight">{s.value}</div>
            <p className="text-[11px] text-[#0F8F6B] font-mono font-medium">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
