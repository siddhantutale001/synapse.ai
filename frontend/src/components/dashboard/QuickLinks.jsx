import React from 'react';
import { Search, FolderGit2, Bot, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function QuickLinks() {
  const { setCurrentScreen } = useWorkspace();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={() => setCurrentScreen('deepsearch')}
        className="p-5 rounded-2xl bg-white hover:bg-[#F5F6FD] border border-[#E6E8F5] hover:border-[#8C5CFF]/40 transition text-left flex items-center justify-between group shadow-xs"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#EEE8FF] text-[#8C5CFF]">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-[#12162A] group-hover:text-[#8C5CFF] transition">Open DeepSearch</h5>
            <p className="text-[11px] text-[#9198B0]">Review paper citations & DOIs</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#9198B0] group-hover:text-[#8C5CFF] transition" />
      </button>

      <button
        onClick={() => setCurrentScreen('projecthub')}
        className="p-5 rounded-2xl bg-white hover:bg-[#F5F6FD] border border-[#E6E8F5] hover:border-[#00D3A0]/40 transition text-left flex items-center justify-between group shadow-xs"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#D9F9EE] text-[#0F8F6B]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-[#12162A] group-hover:text-[#0F8F6B] transition">Open Project HUB</h5>
            <p className="text-[11px] text-[#9198B0]">Architecture & milestone list</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#9198B0] group-hover:text-[#0F8F6B] transition" />
      </button>

      <button
        onClick={() => setCurrentScreen('agent')}
        className="p-5 rounded-2xl bg-white hover:bg-[#F5F6FD] border border-[#E6E8F5] hover:border-[#FF5A3C]/40 transition text-left flex items-center justify-between group shadow-xs"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#FFE3DA] text-[#FF5A3C]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-display font-bold text-sm text-[#12162A] group-hover:text-[#FF5A3C] transition">Message AI Agent</h5>
            <p className="text-[11px] text-[#9198B0]">Telegram pairing & alerts</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#9198B0] group-hover:text-[#FF5A3C] transition" />
      </button>
    </div>
  );
}
