import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Lightbulb,
  Search,
  Network,
  FolderGit2,
  LayoutDashboard,
  Bot,
  Sparkles,
  Sliders,
  LogIn,
  UserPlus,
  Trash2,
  FolderOpen,
  LogOut,
  ChevronUp
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function Sidebar() {
  const { user } = useUser();
  const {
    currentScreen,
    setCurrentScreen,
    activeWorkspace,
    workspaces,
    selectWorkspace,
    deleteWorkspace,
    profile,
    setProfileModalOpen,
    logout,
    deleteProfile
  } = useWorkspace();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const navItems = [
    { id: 'idea', label: 'Idea Studio', icon: Lightbulb, badge: '01' },
    { id: 'deepsearch', label: 'DeepSearch', icon: Search, badge: '02' },
    { id: 'clustering', label: 'Knowledge Clusters', icon: Network, badge: '03' },
    { id: 'projecthub', label: 'Project HUB', icon: FolderGit2, badge: '04' },
    { id: 'dashboard', label: 'Dashboard KPI', icon: LayoutDashboard, badge: '05' },
    { id: 'agent', label: 'Companion Bot', icon: Bot, badge: '06' },
  ];

  const handleDeleteConfirmed = async () => {
    setShowDeleteConfirmModal(false);
    setMenuOpen(false);
    await deleteProfile();
  };

  return (
    <aside className="w-[236px] bg-gradient-to-b from-[#0D0F2B] to-[#1B1550] border-r border-[#272E63]/60 flex flex-col justify-between p-4 min-h-screen select-none relative">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 px-1 pt-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-coral to-violet flex items-center justify-center shadow-lg shadow-coral/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-white tracking-tight">
              synapse<span className="text-coral">.ai</span>
            </h1>
            <p className="text-[10px] text-teal font-mono tracking-wide uppercase">Research Copilot</p>
          </div>
        </div>

        {/* Navigation Item Buttons */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] font-medium text-xs transition-all ${isActive
                    ? 'bg-gradient-to-r from-coral/20 to-violet/15 text-white border-l-[2.5px] border-coral font-semibold shadow-sm'
                    : 'text-[#B7BCD6] hover:text-white hover:bg-white/5 border-l-[2.5px] border-transparent'
                  }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-coral' : 'text-[#8A90AD]'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isActive ? 'bg-coral/20 text-[#FF9F82]' : 'bg-white/5 text-[#8A90AD]'
                  }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Past Projects List Section */}
        <div className="space-y-2 pt-3 border-t border-[#272E63]/60">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono uppercase text-teal flex items-center space-x-1.5 tracking-wider">
              <FolderOpen className="w-3 h-3" />
              <span>Past Projects ({workspaces.length})</span>
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {workspaces.length === 0 ? (
              <div className="p-3 text-center rounded-xl bg-white/5 border border-[#272E63]/40">
                <span className="text-[11px] text-[#8A90AD] block">No past projects saved yet</span>
              </div>
            ) : (
              workspaces.map((ws) => {
                const isSelected = activeWorkspace?.workspaceId === ws.workspaceId;
                return (
                  <div
                    key={ws.workspaceId}
                    onClick={() => selectWorkspace(ws.workspaceId)}
                    className={`group relative p-2.5 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${isSelected
                        ? 'bg-[#181C45] border-teal/50 shadow-md'
                        : 'bg-white/5 border-[#272E63]/50 hover:bg-white/10 hover:border-violet/30'
                      }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-teal' : 'text-white group-hover:text-violet'}`}>
                        {ws.title}
                      </h4>
                      <span className="text-[9px] text-[#8A90AD] font-mono block mt-0.5 uppercase">
                        {ws.status || 'COMPLETED'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => deleteWorkspace(ws.workspaceId, e)}
                      className="opacity-60 hover:opacity-100 p-1 text-[#8A90AD] hover:text-coral hover:bg-coral/10 rounded-lg transition"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Profile Card Footer & Dropdown Menu */}
      <div className="pt-4 border-t border-[#272E63]/60 space-y-2 relative">
        <SignedIn>
          {/* Action Popover Menu */}
          {menuOpen && (
            <div className="absolute bottom-16 left-0 right-0 bg-[#181C45] border border-[#272E63] rounded-xl shadow-2xl p-1.5 space-y-1 animate-fadeIn z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 rounded-lg transition"
              >
                <Sliders className="w-4 h-4 text-teal" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 text-violet" />
                <span>Log Out</span>
              </button>

              <div className="h-px bg-[#272E63] my-1" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowDeleteConfirmModal(true);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-coral hover:bg-coral/15 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-coral" />
                <span>Delete Account</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#181C45] border border-[#272E63]/80 cursor-pointer hover:border-violet/40 transition"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <UserButton userProfileMode="navigation" />
              <div className="min-w-0">
                <h5 className="text-xs font-semibold text-white truncate">
                  {profile?.displayName || user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'User'}
                </h5>
                <p className="text-[10px] text-teal font-mono truncate">{profile?.geminiAiPreferences?.personaMode || 'HACKATHON_SPRINT'}</p>
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-[#8A90AD] transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="p-2.5 rounded-xl bg-[#181C45] border border-[#272E63]/80 space-y-2">
            <SignInButton mode="modal">
              <button className="w-full bg-violet hover:bg-violet/90 text-white font-medium text-xs py-2 rounded-lg transition flex items-center justify-center space-x-1.5">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In via Clerk</span>
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs py-1.5 rounded-lg transition flex items-center justify-center space-x-1.5 border border-[#272E63]">
                <UserPlus className="w-3.5 h-3.5 text-teal" />
                <span>Create Student Account</span>
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>

      {/* Confirmation Dialog for Profile Deletion */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-[#0D0F2B]/85 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fadeIn">
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
                onClick={() => setShowDeleteConfirmModal(false)}
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

      {/* Copyright Footer */}
      <div className="px-4 pb-4 pt-2">
        <p className="text-[10px] text-[#9198B0]/60 font-mono text-center leading-relaxed">
          © 2026 A Research CoPilot by{' '}
          <span className="text-[#8C5CFF]/70 font-semibold">Team Catalyst</span>
        </p>
      </div>
    </aside>
  );
}
