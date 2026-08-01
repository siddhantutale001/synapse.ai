import React, { useState, useEffect } from 'react';
import { User, Sparkles, BookOpen, Bell, Save, X, Github, Linkedin, CheckCircle2, AlertCircle, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { verifyGithubProfile, validateLinkedInUrl, validateEmail } from '../../utils/validation.js';

export default function ProfileModal() {
  const { profileModalOpen, setProfileModalOpen, profile, setProfile, deleteProfile } = useWorkspace();
  const [activeTab, setActiveTab] = useState('academic'); // academic | gemini | research | companion
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [localProfile, setLocalProfile] = useState({
    displayName: '',
    email: '',
    academic: {
      college: '',
      major: '',
      yearOfStudy: '3rd Year',
      developerRole: 'Full-Stack Lead',
      githubUrl: '',
      linkedinUrl: ''
    },
    geminiAiPreferences: {
      aboutUser: '',
      personaMode: 'HACKATHON_SPRINT',
      preferredLanguages: ['Python', 'TypeScript'],
      preferredFrontend: 'React',
      preferredBackend: 'Express',
      preferredDatabase: 'Firebase'
    },
    researchSettings: {
      sourceTypes: ['PAPERS', 'GITHUB_REPOS', 'DOCUMENTATION'],
      recencyFilter: 'PAST_1_YEAR',
      includeCodeSnippets: true
    },
    companionSettings: {
      telegramChatId: '',
      nudgeFrequency: 'DAILY_MORNING'
    }
  });

  const [githubStatus, setGithubStatus] = useState({ checking: false, valid: false, message: '', avatar: null });
  const [linkedinStatus, setLinkedinStatus] = useState({ valid: false, message: '' });
  const [emailStatus, setEmailStatus] = useState({ valid: false, message: '' });

  useEffect(() => {
    if (profileModalOpen) {
      if (profile && (profile.displayName || profile.academic?.college || profile.email)) {
        setLocalProfile(prev => ({ ...prev, ...profile }));
      }
      api.get('/user/profile')
        .then(res => {
          if (res.data?.data && (res.data.data.displayName || res.data.data.academic?.college)) {
            setLocalProfile(prev => ({ ...prev, ...res.data.data }));
          }
        })
        .catch(err => console.warn('Fetch profile notice:', err.message));
    }
  }, [profileModalOpen, profile]);

  // Live GitHub verification
  useEffect(() => {
    const url = localProfile.academic?.githubUrl;
    if (!url) {
      setGithubStatus({ checking: false, valid: false, message: '', avatar: null });
      return;
    }
    setGithubStatus(prev => ({ ...prev, checking: true }));
    const timer = setTimeout(async () => {
      const res = await verifyGithubProfile(url);
      setGithubStatus({
        checking: false,
        valid: res.valid,
        message: res.message,
        avatar: res.avatar || null
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [localProfile.academic?.githubUrl]);

  // Live LinkedIn validation
  useEffect(() => {
    const url = localProfile.academic?.linkedinUrl;
    if (!url) {
      setLinkedinStatus({ valid: false, message: '' });
      return;
    }
    const res = validateLinkedInUrl(url);
    setLinkedinStatus({ valid: res.valid, message: res.message });
  }, [localProfile.academic?.linkedinUrl]);

  // Live Email validation
  useEffect(() => {
    const email = localProfile.email;
    if (!email) {
      setEmailStatus({ valid: false, message: '' });
      return;
    }
    const res = validateEmail(email);
    setEmailStatus({ valid: res.valid, message: res.message });
  }, [localProfile.email]);

  const handleSave = async () => {
    try {
      await api.put('/user/profile/ai-preferences', localProfile.geminiAiPreferences);
      await api.put('/user/profile/academic', {
        displayName: localProfile.displayName,
        email: localProfile.email,
        ...localProfile.academic
      });
      setProfile(localProfile);
      setProfileModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleDeleteConfirmed = async () => {
    setShowConfirmDelete(false);
    setProfileModalOpen(false);
    await deleteProfile();
  };

  if (!profileModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0D0F2B]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-[#E6E8F5] rounded-2xl max-w-3xl w-full p-6 text-[#12162A] shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E6E8F5] pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-[#FF5A3C]">Settings & Custom AI Persona</h2>
            <p className="text-xs text-[#5B6178]">Customize how Synapse AI researches, formats code, and structures project plans.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-[#FF5A3C] to-[#8C5CFF] hover:from-[#FF5A3C]/90 hover:to-[#8C5CFF]/90 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md shadow-[#FF5A3C]/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
            <button
              onClick={() => setProfileModalOpen(false)}
              className="p-2 text-[#9198B0] hover:text-[#12162A] rounded-xl hover:bg-[#F5F6FD] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-[#E6E8F5] pb-2">
          {[
            { id: 'academic', label: '👤 Academic Profile', icon: User },
            { id: 'gemini', label: '🧠 Custom Persona', icon: Sparkles },
            { id: 'research', label: '🔬 Research Sources', icon: BookOpen },
            { id: 'companion', label: '🔔 Companions', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#EEE8FF] text-[#8C5CFF] border border-[#8C5CFF]/30 font-bold'
                    : 'text-[#5B6178] hover:text-[#12162A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Tab 1: Academic & Developer Profile */}
          {activeTab === 'academic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">Full Display Name</label>
                  <input
                    type="text"
                    value={localProfile.displayName || ''}
                    onChange={e => setLocalProfile({ ...localProfile, displayName: e.target.value })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center justify-between">
                    <span>Student Email</span>
                    {emailStatus.message && (
                      emailStatus.valid ? (
                        <span className="text-[10px] text-[#0F8F6B] font-mono flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-[#00D3A0]" />
                          <span>Valid</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#FF5A3C] font-mono flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Invalid</span>
                        </span>
                      )
                    )}
                  </label>
                  <input
                    type="email"
                    value={localProfile.email || ''}
                    onChange={e => setLocalProfile({ ...localProfile, email: e.target.value })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">College / University</label>
                  <input
                    type="text"
                    value={localProfile.academic?.college || ''}
                    onChange={e => setLocalProfile({ ...localProfile, academic: { ...localProfile.academic, college: e.target.value } })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">Academic Major</label>
                  <input
                    type="text"
                    value={localProfile.academic?.major || ''}
                    onChange={e => setLocalProfile({ ...localProfile, academic: { ...localProfile.academic, major: e.target.value } })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">Year of Study</label>
                  <select
                    value={localProfile.academic?.yearOfStudy || '3rd Year'}
                    onChange={e => setLocalProfile({ ...localProfile, academic: { ...localProfile.academic, yearOfStudy: e.target.value } })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year / Final">4th Year / Final</option>
                    <option value="Postgraduate / MTech">Postgraduate / MTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">Developer Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack Lead"
                    value={localProfile.academic?.developerRole || ''}
                    onChange={e => setLocalProfile({ ...localProfile, academic: { ...localProfile.academic, developerRole: e.target.value } })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  />
                </div>

                {/* GitHub input with Live API verification + Avatar display */}
                <div className={githubStatus.valid && githubStatus.avatar ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub Profile Handle / URL</span>
                    </span>
                    {githubStatus.checking ? (
                      <span className="text-[10px] text-[#9198B0] font-mono flex items-center space-x-1">
                        <RefreshCw className="w-3 h-3 animate-spin text-[#8C5CFF]" />
                        <span>Verifying...</span>
                      </span>
                    ) : githubStatus.message ? (
                      githubStatus.valid ? (
                        <span className="text-[10px] text-[#0F8F6B] font-mono font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-[#00D3A0]" />
                          <span>{githubStatus.message}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#FF5A3C] font-mono font-semibold flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 text-[#FF5A3C]" />
                          <span>{githubStatus.message}</span>
                        </span>
                      )
                    ) : null}
                  </label>
                  <div className={`flex items-start gap-3 ${githubStatus.valid && githubStatus.avatar ? 'flex-row' : ''}`}>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="https://github.com/username"
                        value={localProfile.academic?.githubUrl || ''}
                        onChange={e => setLocalProfile({ ...localProfile, academic: { ...localProfile.academic, githubUrl: e.target.value } })}
                        className={`w-full bg-[#F5F6FD] border rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none transition ${
                          githubStatus.valid 
                            ? 'border-[#00D3A0] bg-white' 
                            : githubStatus.message && !githubStatus.valid 
                            ? 'border-[#FF5A3C] bg-white' 
                            : 'border-[#E6E8F5] focus:border-[#8C5CFF]'
                        }`}
                      />
                    </div>
                    {/* GitHub Avatar Card — shown on the right when verified */}
                    {githubStatus.valid && githubStatus.avatar && (
                      <div className="flex flex-col items-center gap-1.5 bg-[#F5F6FD] border border-[#00D3A0]/40 rounded-xl px-3 py-2 min-w-[80px]">
                        <img
                          src={githubStatus.avatar}
                          alt="GitHub Avatar"
                          className="w-10 h-10 rounded-full border-2 border-[#00D3A0] shadow-sm"
                        />
                        <span className="text-[9px] font-mono text-[#0F8F6B] font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* LinkedIn input with live format check */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile URL</span>
                    </span>
                    {linkedinStatus.message && (
                      linkedinStatus.valid ? (
                        <span className="text-[10px] text-[#0F8F6B] font-mono flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-[#00D3A0]" />
                          <span>Valid</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#FF5A3C] font-mono flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Invalid format</span>
                        </span>
                      )
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={localProfile.academic?.linkedinUrl || ''}
                    onChange={e => setLocalProfile({ ...localProfile, academic: { ...localProfile.academic, linkedinUrl: e.target.value } })}
                    className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  />
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="p-4 rounded-xl border border-[#FF5A3C]/30 bg-[#FFE3DA]/40 space-y-3 mt-6">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#FF5A3C] uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#FF5A3C]" />
                    <span>Danger Zone</span>
                  </h4>
                  <p className="text-xs text-[#5B6178] mt-0.5">
                    Permanently delete your user profile and all associated research workspaces. This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="bg-[#FF5A3C] hover:bg-[#FF5A3C]/90 text-white font-display font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-2 shadow-md shadow-[#FF5A3C]/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Profile & Workspaces</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Gemini AI Persona & Custom Instructions */}
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1.5">
                  What should Synapse know about you? (Custom Instructions)
                </label>
                <textarea
                  rows={3}
                  value={localProfile.geminiAiPreferences?.aboutUser || ''}
                  onChange={e => setLocalProfile({
                    ...localProfile,
                    geminiAiPreferences: { ...localProfile.geminiAiPreferences, aboutUser: e.target.value }
                  })}
                  className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl p-3.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF]"
                  placeholder="e.g. 3rd year CS student. Comfort with Python and React. Keep explanations concise."
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-2">AI Persona Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'HACKATHON_SPRINT', title: '🏎️ Hackathon Sprint', desc: 'Fast, code-first, actionable deliverables' },
                    { id: 'ACADEMIC_RESEARCH', title: '🎓 Academic & Literature', desc: 'Deep IEEE citations, math equations' },
                    { id: 'ELI5_BEGINNER', title: '🐣 Beginner Friendly', desc: 'Step-by-step simple explanations' },
                    { id: 'ENTERPRISE_ARCHITECT', title: '🏗️ Enterprise Architect', desc: 'Microservices, security, scalability focus' },
                  ].map(mode => {
                    const isSelected = localProfile.geminiAiPreferences?.personaMode === mode.id;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => setLocalProfile({
                          ...localProfile,
                          geminiAiPreferences: { ...localProfile.geminiAiPreferences, personaMode: mode.id }
                        })}
                        className={`p-3.5 border rounded-xl cursor-pointer transition ${
                          isSelected ? 'border-[#8C5CFF] bg-[#EEE8FF] text-[#12162A]' : 'border-[#E6E8F5] bg-[#F5F6FD] text-[#5B6178] hover:border-[#9198B0]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-xs text-[#12162A]">{mode.title}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#00D3A0]" />}
                        </div>
                        <p className="text-[11px] text-[#9198B0] mt-1">{mode.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: DeepSearch Sources */}
          {activeTab === 'research' && (
            <div className="space-y-4 bg-[#F5F6FD] p-4 rounded-xl border border-[#E6E8F5]">
              <h4 className="text-xs font-bold text-[#FF5A3C] font-mono uppercase">DeepSearch Citation Sources</h4>
              <div className="space-y-2 text-xs">
                <label className="flex items-center space-x-2 text-[#12162A] cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#FF5A3C]" />
                  <span>arXiv & IEEE Peer-Reviewed Papers</span>
                </label>
                <label className="flex items-center space-x-2 text-[#12162A] cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#FF5A3C]" />
                  <span>GitHub Repositories & Open Source Implementations</span>
                </label>
                <label className="flex items-center space-x-2 text-[#12162A] cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#FF5A3C]" />
                  <span>Official Framework Documentation</span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 4: AI Companion Settings */}
          {activeTab === 'companion' && (
            <div className="space-y-4 bg-[#F5F6FD] p-4 rounded-xl border border-[#E6E8F5]">
              <h4 className="text-xs font-bold text-[#0F8F6B] font-mono uppercase">Telegram Companion Nudges</h4>
              <div>
                <label className="block text-[11px] font-mono text-[#9198B0] mb-1">Daily Nudge Schedule</label>
                <select
                  value={localProfile.companionSettings?.nudgeFrequency || 'DAILY_MORNING'}
                  onChange={e => setLocalProfile({
                    ...localProfile,
                    companionSettings: { ...localProfile.companionSettings, nudgeFrequency: e.target.value }
                  })}
                  className="bg-white border border-[#E6E8F5] text-xs text-[#12162A] rounded-lg px-3 py-1.5"
                >
                  <option value="DAILY_MORNING">Daily Morning (8:00 AM)</option>
                  <option value="MILESTONE_DUE_ONLY">Milestone Deadline Reminders Only</option>
                  <option value="OFF">Turn Off Companion Notifications</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Profile & Workspace Deletion */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-[#0D0F2B]/90 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#FF5A3C]/40 rounded-2xl max-w-md w-full p-6 text-[#12162A] shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE3DA] text-[#FF5A3C] border border-[#FF5A3C]/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-[#12162A]">Delete Account & Workspaces?</h3>
              <p className="text-xs text-[#5B6178] leading-relaxed">
                Are you sure you want to delete your profile? All saved citations, clusters, and Project HUB roadmaps will be permanently erased.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 bg-[#F5F6FD] hover:bg-[#E6E8F5] text-[#12162A] font-semibold text-xs py-2.5 rounded-xl border border-[#E6E8F5] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="flex-1 bg-[#FF5A3C] hover:bg-[#FF5A3C]/90 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-md shadow-[#FF5A3C]/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
