import React from 'react';
import { BookOpen, Github, MessageSquare, Database, Layers } from 'lucide-react';

export default function FilterChips({ activeFilter, setActiveFilter }) {
  const filters = [
    { id: 'ALL', label: 'All Sources', icon: Layers },
    { id: 'PAPER', label: 'Research Papers', icon: BookOpen },
    { id: 'GITHUB', label: 'GitHub Repos', icon: Github },
    { id: 'FORUM', label: 'Tech Forums', icon: MessageSquare },
    { id: 'DATASET', label: 'Datasets', icon: Database },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => {
        const Icon = f.icon;
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center space-x-2 border ${
              isActive
                ? 'bg-[#0D0F2B] text-white border-[#0D0F2B] font-semibold shadow-xs'
                : 'bg-white text-[#5B6178] border-[#E6E8F5] hover:text-[#12162A] hover:border-[#9198B0]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
