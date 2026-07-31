import React from 'react';
import { FolderGit2, Trash2, ArrowUpRight, Plus } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function PastProjectsGrid() {
  const { workspaces, activeWorkspace, selectWorkspace, deleteWorkspace, setCurrentScreen } = useWorkspace();

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl text-center space-y-2 border border-[#E6E8F5] shadow-xs">
        <h4 className="text-xs font-semibold text-[#12162A]">No Projects Available</h4>
        <p className="text-[11px] text-[#9198B0]">Submit your first idea prompt in Idea Studio to generate a research workspace.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6E8F5] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-[#12162A] flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-[#0F8F6B]" />
            <span>Past Projects ({workspaces.length})</span>
          </h3>
          <p className="text-xs text-[#5B6178]">Manage, switch, or remove previous research workspaces</p>
        </div>

        <button
          onClick={() => setCurrentScreen('idea')}
          className="bg-[#EEE8FF] hover:bg-[#8C5CFF]/20 text-[#8C5CFF] border border-[#8C5CFF]/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((ws) => {
          const isActive = activeWorkspace?.workspaceId === ws.workspaceId;
          return (
            <div
              key={ws.workspaceId}
              onClick={() => selectWorkspace(ws.workspaceId)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 group ${
                isActive
                  ? 'bg-white border-[#00D3A0] shadow-md ring-1 ring-[#00D3A0]'
                  : 'bg-[#F5F6FD] hover:bg-white border-[#E6E8F5] hover:border-[#8C5CFF]/40 shadow-xs'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#D9F9EE] text-[#0F8F6B] font-bold' : 'bg-[#E6E8F5] text-[#9198B0]'
                  }`}>
                    {ws.workspaceId}
                  </span>

                  <button
                    onClick={(e) => deleteWorkspace(ws.workspaceId, e)}
                    className="p-1.5 text-[#9198B0] hover:text-[#FF5A3C] hover:bg-[#FFE3DA] rounded-lg transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-display font-bold text-sm text-[#12162A] group-hover:text-[#8C5CFF] transition line-clamp-1">
                  {ws.title}
                </h4>

                <p className="text-xs text-[#5B6178] line-clamp-2 leading-relaxed">
                  {ws.rawIdea || 'Research workspace'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E6E8F5] text-xs">
                <span className="text-[10px] font-mono uppercase text-[#0F8F6B]">{ws.status || 'COMPLETED'}</span>
                <span className="text-[#9198B0] group-hover:text-[#12162A] font-semibold flex items-center space-x-1">
                  <span>Open</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
