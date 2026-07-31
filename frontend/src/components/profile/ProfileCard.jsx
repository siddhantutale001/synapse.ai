import React from 'react';
import { User, Sliders, LogOut } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function ProfileCard() {
  const { profile, setProfileModalOpen } = useWorkspace();

  return (
    <div className="p-3 bg-ink rounded-xl border border-[#272E63] space-y-2">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-coral to-violet flex items-center justify-center font-bold text-xs text-white">
          {profile?.displayName?.substring(0, 2).toUpperCase() || 'AC'}
        </div>
        <div>
          <h5 className="text-xs font-bold text-paper">{profile?.displayName || 'Alex Chen'}</h5>
          <p className="text-[10px] text-teal font-mono">{profile?.geminiAiPreferences?.personaMode}</p>
        </div>
      </div>

      <button
        onClick={() => setProfileModalOpen(true)}
        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-ink-3 hover:bg-ink-2 text-faint hover:text-white text-[11px] transition border border-[#272E63]"
      >
        <Sliders className="w-3.5 h-3.5 text-coral" />
        <span>Manage AI Preferences</span>
      </button>
    </div>
  );
}
