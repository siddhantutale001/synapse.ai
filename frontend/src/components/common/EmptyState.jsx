import React from 'react';
import { FolderPlus, Sparkles } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function EmptyState({ screenName }) {
  const { setCurrentScreen } = useWorkspace();

  return (
    <div className="max-w-xl mx-auto my-12 p-8 glass-panel rounded-2xl text-center space-y-4 border border-[#272E63] animate-fadeIn">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-violet/15 text-violet border border-violet/30 flex items-center justify-center">
        <FolderPlus className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display font-bold text-lg text-paper">No Active Research Project</h3>
        <p className="text-xs text-subtext leading-relaxed">
          There is no active project selected for <span className="text-teal font-semibold">{screenName}</span>. Analyze a new prompt in Idea Studio to generate results.
        </p>
      </div>

      <button
        onClick={() => setCurrentScreen('idea')}
        className="bg-gradient-to-r from-coral to-violet hover:from-coral/90 hover:to-violet/90 text-white font-display font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center space-x-2 mx-auto"
      >
        <Sparkles className="w-4 h-4" />
        <span>Create Project in Idea Studio</span>
      </button>
    </div>
  );
}
