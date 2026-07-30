import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Users, Download, Bot, Sun, Moon, Languages, PlusCircle, LayoutDashboard, Printer, Code, FileText, ChevronDown, User, CheckCircle, Settings, Trash2, LogOut } from 'lucide-react';
import { exportToMarkdown, exportToTxt, exportProjectToPDF } from '../utils/exportHelpers';

export default function Header({
  darkMode,
  setDarkMode,
  onOpenMultiUser,
  onOpenTelegram,
  onNewIdeaClick,
  onDashboardClick,
  activeView,
  currentWorkspace,
  showSplash = false,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenDeleteModal,
}) {
  const { lang, setLang, t } = useLanguage();
  const { roomCode, collaborators } = useSocket();
  const { user, logout } = useAuth();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(!showSplash);
  const isHoveredRef = React.useRef(false);

  React.useEffect(() => {
    if (showSplash) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e) => {
      // Reveal if cursor near top of screen (top 90px), header hovered, export dropdown open, or user menu open
      if (e.clientY <= 90 || isHoveredRef.current || showExportMenu || showUserMenu) {
        setIsVisible(true);
      } else if (e.clientY > 140 && !showExportMenu && !showUserMenu && !isHoveredRef.current) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showExportMenu, showUserMenu, showSplash]);

  if (showSplash) return null;

  return (
    <>
      {/* Invisible hover trigger zone at the very top edge */}
      <div
        className="fixed top-0 left-0 right-0 h-4 z-50 pointer-events-auto"
        onMouseEnter={() => setIsVisible(true)}
      />

      <header
        onMouseEnter={() => {
          isHoveredRef.current = true;
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        className={`fixed top-3 left-0 right-0 z-50 w-full px-4 no-print transition-all duration-500 ease-out transform ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : '-translate-y-24 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="rounded-full max-w-6xl mx-auto px-5 py-2 bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-800/80 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 dark:shadow-black/50 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer btn-interactive" onClick={onNewIdeaClick}>
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-cyber-purple to-cyber-cyan p-0.5 shadow-md shadow-indigo-500/10">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Synapse<span className="text-brand-600 dark:text-brand-500">.ai</span>
            </h1>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              v2.0
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Dashboard vs New Idea toggle */}
          <button
            onClick={activeView === 'dashboard' ? onNewIdeaClick : onDashboardClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition btn-interactive"
          >
            {activeView === 'dashboard' ? (
              <>
                <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('newIdea')}</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span>{t('myWorkspaces')}</span>
              </>
            )}
          </button>

          {/* Multi-User Collaboration Room Button */}
          <button
            onClick={onOpenMultiUser}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition btn-interactive ${
              roomCode
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span className="hidden md:inline">
              {roomCode ? `Room: ${roomCode}` : t('shareRoom')}
            </span>
            {collaborators.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                {collaborators.length}
              </span>
            )}
          </button>

          {/* Telegram Companion Bot Button */}
          <button
            onClick={onOpenTelegram}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition btn-interactive"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{t('telegramBot')}</span>
          </button>

          {/* Multi-Format Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md btn-interactive transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 py-1 space-y-0.5 animate-slide-up">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportProjectToPDF(currentWorkspace);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-500" />
                  <span>PDF (.pdf)</span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportToMarkdown(currentWorkspace);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <Code className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                  <span>Markdown (.md)</span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportToTxt(currentWorkspace);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Plain Text (.txt)</span>
                </button>
              </div>
            )}
          </div>

          {/* Cleaned Language Switcher */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-1 hidden sm:block" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">EN (English)</option>
              <option value="es" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">ES (Español)</option>
              <option value="fr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">FR (Français)</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white transition btn-interactive"
            title={darkMode ? t('lightTheme') : t('darkTheme')}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* User Auth Controls / Profile Dropdown */}
          <div className="relative">
            {!user ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 transition btn-interactive shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-indigo-400 dark:text-cyan-400" />
                <span>Sign In</span>
              </button>
            ) : (
              <div>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowExportMenu(false);
                  }}
                  className="relative flex items-center justify-center p-0.5 rounded-full btn-interactive"
                >
                  {user.avatar && user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-md border border-white/40 dark:border-slate-700" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${user.avatar || 'bg-gradient-to-tr from-indigo-500 to-cyan-400'} flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/40 dark:border-slate-700`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  {/* Green Online Status Dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 space-y-1 animate-slide-up">
                    {/* User Header */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">{user.name}</h4>
                        {user.isVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Unverified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-0.5 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenProfileModal();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                      >
                        <Settings className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenDeleteModal();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                        <span>Delete Account</span>
                      </button>

                      <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                      >
                        <LogOut className="w-4 h-4 text-slate-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

