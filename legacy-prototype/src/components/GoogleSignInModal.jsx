import React, { useState } from 'react';
import { X, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mockGoogleAccounts = [
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@gmail.com',
    avatar: 'bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500',
    bio: 'Lead AI Engineer & Neural Architecture Researcher.',
  },
  {
    name: 'Sophia Chen',
    email: 'sophia.chen@gmail.com',
    avatar: 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400',
    bio: 'Product Designer & Human-AI Interaction Specialist.',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@gmail.com',
    avatar: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500',
    bio: 'Distributed Systems & Cloud ML Architect.',
  },
];

export default function GoogleSignInModal({ isOpen, onClose }) {
  const { googleLogin } = useAuth();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = (account) => {
    googleLogin(account);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    const name = customName.trim() || customEmail.split('@')[0];
    googleLogin({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: customEmail.trim(),
      avatar: 'bg-gradient-to-tr from-blue-500 to-indigo-600',
      bio: 'Google Authenticated User',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Sign in with Google</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose an account to continue to Synapse.ai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!showCustomInput ? (
            <>
              <div className="space-y-2">
                {mockGoogleAccounts.map((account, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAccount(account)}
                    className="w-full p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition group text-left btn-interactive"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${account.avatar} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {account.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition">
                          {account.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{account.email}</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Use another Google account</span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@gmail.com"
                  value={customEmail}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition btn-interactive"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span>To continue, Google will share your name and email with Synapse.ai.</span>
        </div>
      </div>
    </div>
  );
}
