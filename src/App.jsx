import React, { useState, useEffect } from 'react';
import IntroSplash from './components/IntroSplash';
import Header from './components/Header';
import IdeaInput from './components/IdeaInput';
import Dashboard from './components/Dashboard';
import MultiUserModal from './components/MultiUserModal';
import TelegramBotCard from './components/TelegramBotCard';
import SectionTabs from './components/SectionTabs';

// Auth & User Profile Modals
import AuthModal from './components/AuthModal';
import GoogleSignInModal from './components/GoogleSignInModal';
import ProfileModal from './components/ProfileModal';
import DeleteAccountModal from './components/DeleteAccountModal';

// 11 Section Components
import ProblemValidation from './components/sections/ProblemValidation';
import MarketResearch from './components/sections/MarketResearch';
import ComparisonMatrix from './components/sections/ComparisonMatrix';
import InnovationGaps from './components/sections/InnovationGaps';
import ProjectArchitecture from './components/sections/ProjectArchitecture';
import DevelopmentRoadmap from './components/sections/DevelopmentRoadmap';
import TechStack from './components/sections/TechStack';
import GitHubRepos from './components/sections/GitHubRepos';
import APIsAndDatasets from './components/sections/APIsAndDatasets';
import ImplementationTimeline from './components/sections/ImplementationTimeline';
import PresentationExport from './components/sections/PresentationExport';
import PrintableFullReport from './components/PrintableFullReport';

import { fallbackPlanData } from './data/fallbackData';
import { createDynamicFallbackPlan } from './utils/dynamicFallback';
import { useSocket } from './context/SocketContext';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // MUST BE DARK MODE BY DEFAULT
  const [activeView, setActiveView] = useState('new');
  const [activeTab, setActiveTab] = useState('problemValidation');
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState([fallbackPlanData]);
  const [currentWorkspace, setCurrentWorkspace] = useState(fallbackPlanData);

  // Modals
  const [showMultiUser, setShowMultiUser] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);

  // Auth Modals State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { socket, activeTabSync } = useSocket();

  // Synchronize theme with documentElement classList ('dark' vs 'light')
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (activeTabSync) {
      setActiveTab(activeTabSync);
    }
  }, [activeTabSync]);

  useEffect(() => {
    fetch('/api/v1/insights/workspaces')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWorkspaces(data);
        }
      })
      .catch(() => {
        console.warn('Backend server unreached, using local fallback store.');
      });
  }, []);

  const handleGenerate = async (ideaText, files = []) => {
    setLoading(true);

    let fullPrompt = ideaText;
    if (files.length > 0) {
      const fileNames = files.map((f) => f.name).join(', ');
      fullPrompt += ` (Attached Context Files: ${fileNames})`;
    }

    try {
      const res = await fetch('/api/v1/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: fullPrompt, attachments: files.map((f) => f.name) }),
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const newWs = await res.json();
      setWorkspaces((prev) => [newWs, ...prev]);
      setCurrentWorkspace(newWs);
      setActiveView('workspace');
    } catch (err) {
      console.warn('⚠️ Server generation failed. Utilizing dynamic fallback plan.', err);
      const dynamicWs = createDynamicFallbackPlan(fullPrompt || ideaText);
      setWorkspaces((prev) => [dynamicWs, ...prev]);
      setCurrentWorkspace(dynamicWs);
      setActiveView('workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await fetch(`/api/v1/insights/workspaces/${id}`, { method: 'DELETE' });
    } catch (e) {}

    const remaining = workspaces.filter((w) => (w._id || w.id) !== id);
    setWorkspaces(remaining);

    if ((currentWorkspace._id || currentWorkspace.id) === id) {
      if (remaining.length > 0) {
        setCurrentWorkspace(remaining[0]);
      } else {
        setCurrentWorkspace(null);
        setActiveView('new');
      }
    }
  };

  const renderActiveSection = () => {
    if (!currentWorkspace) return null;

    switch (activeTab) {
      case 'problemValidation':
        return <ProblemValidation data={currentWorkspace} />;
      case 'marketResearch':
        return <MarketResearch data={currentWorkspace} />;
      case 'comparisonMatrix':
        return <ComparisonMatrix data={currentWorkspace} />;
      case 'innovationGaps':
        return <InnovationGaps data={currentWorkspace} />;
      case 'architecture':
        return <ProjectArchitecture data={currentWorkspace} />;
      case 'roadmap':
        return <DevelopmentRoadmap data={currentWorkspace} />;
      case 'techStack':
        return <TechStack data={currentWorkspace} />;
      case 'githubRepos':
        return <GitHubRepos data={currentWorkspace} />;
      case 'apisDatasets':
        return <APIsAndDatasets data={currentWorkspace} />;
      case 'timeline':
        return <ImplementationTimeline data={currentWorkspace} />;
      case 'presentationExport':
        return <PresentationExport data={currentWorkspace} />;
      default:
        return <ProblemValidation data={currentWorkspace} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden">
      {/* 1. SPATIAL AMBIENT MESH & GLOW ORBS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-36 -left-36 w-[550px] h-[550px] rounded-full bg-cyan-500/20 dark:bg-cyan-500/25 blur-[120px] animate-float-slow" />
        <div className="absolute top-1/4 -right-36 w-[650px] h-[650px] rounded-full bg-indigo-600/20 dark:bg-indigo-500/25 blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-12 left-12 w-[500px] h-[500px] rounded-full bg-violet-600/20 dark:bg-purple-600/25 blur-[130px] animate-float-slow delay-150" />
      </div>

      <div className="relative z-10">
        {/* iOS App Intro Splash Screen */}
        {showSplash && <IntroSplash onComplete={() => setShowSplash(false)} />}

        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenMultiUser={() => setShowMultiUser(true)}
          onOpenTelegram={() => setShowTelegram(true)}
          onNewIdeaClick={() => setActiveView('new')}
          onDashboardClick={() => setActiveView('dashboard')}
          activeView={activeView}
          currentWorkspace={currentWorkspace}
          showSplash={showSplash}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenProfileModal={() => setShowProfileModal(true)}
          onOpenDeleteModal={() => setShowDeleteModal(true)}
        />

      <main className="pt-20 pb-16 animate-fade-in no-print print:hidden">
        {activeView === 'new' && (
          <div className="space-y-8">
            <IdeaInput onGenerate={handleGenerate} loading={loading} />
            {currentWorkspace && (
              <div className="max-w-7xl mx-auto px-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Active Project Plan
                  </h3>
                  <button
                    onClick={() => setActiveView('workspace')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Open Workspace →
                  </button>
                </div>
                <div className="p-4 rounded-2xl ios-glass glass-shimmer flex items-center justify-between shadow-sm card-hover">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{currentWorkspace.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{currentWorkspace.rawIdea}</p>
                  </div>
                  <button
                    onClick={() => setActiveView('workspace')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md btn-interactive"
                  >
                    View 11 Sections
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'dashboard' && (
          <Dashboard
            workspaces={workspaces}
            onSelectWorkspace={(ws) => {
              setCurrentWorkspace(ws);
              setActiveView('workspace');
            }}
            onDeleteWorkspace={handleDeleteWorkspace}
            onNewIdeaClick={() => setActiveView('new')}
          />
        )}

        {activeView === 'workspace' && currentWorkspace && (
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 px-4 py-3.5 no-print backdrop-blur-md">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {currentWorkspace.shareCode || 'SYNC-7788'}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{currentWorkspace.title}</h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{currentWorkspace.rawIdea}</p>
                </div>
              </div>
            </div>

            <SectionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="max-w-7xl mx-auto px-4 pt-2">
              {renderActiveSection()}
            </div>
          </div>
        )}
      </main>

      {showMultiUser && (
        <MultiUserModal
          currentShareCode={currentWorkspace?.shareCode || 'SYNC-7788'}
          onClose={() => setShowMultiUser(false)}
        />
      )}

      {showTelegram && (
        <TelegramBotCard onClose={() => setShowTelegram(false)} />
      )}

      {/* Auth & Profile Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onOpenGoogle={() => {
          setShowAuthModal(false);
          setShowGoogleModal(true);
        }}
      />

      <GoogleSignInModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenDeleteModal={() => setShowDeleteModal(true)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      {/* Printable Full PDF Report (Active during PDF Export / window.print()) */}
      {currentWorkspace && (
        <div className="hidden print:block printable-report-wrapper">
          <PrintableFullReport workspace={currentWorkspace} />
        </div>
      )}
      </div>
    </div>
  );
}
