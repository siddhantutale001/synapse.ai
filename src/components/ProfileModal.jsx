import React, { useState, useEffect } from 'react';
import { X, User, Shield, AlertTriangle, CheckCircle, Save, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const avatarPresets = [
  { label: 'Indigo / Cyan', value: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400' },
  { label: 'Emerald / Teal', value: 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500' },
  { label: 'Amber / Rose', value: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500' },
  { label: 'Violet / Fuchsia', value: 'bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-400' },
  { label: 'Cyber Cyan', value: 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700' },
];

export default function ProfileModal({ isOpen, onClose, onOpenDeleteModal }) {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'danger'

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security Tab Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || avatarPresets[0].value);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, bio, avatar });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (user.authProvider === 'google') {
      setPasswordError('Google authenticated accounts manage passwords directly through Google OAuth.');
      return;
    }

    if (user.password && currentPassword !== user.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    updateProfile({ password: newPassword });
    setPasswordSuccess('Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-white/40 dark:border-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {avatar && avatar.startsWith('http') ? (
              <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
            ) : (
              <div className={`w-8 h-8 rounded-full ${avatar} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Auth</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'danger'
                ? 'border-rose-500 text-rose-500 bg-white dark:bg-slate-900 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-rose-500'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Danger Zone</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              {savedSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-slide-up">
                  <Check className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Research Focus
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your research or project focus..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Avatar Preset Gradient
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset.value)}
                      className={`h-10 rounded-xl ${preset.value} flex items-center justify-center text-white font-bold text-xs transition border-2 ${
                        avatar === preset.value ? 'border-white ring-2 ring-indigo-500 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      {avatar === preset.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 btn-interactive transition flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Auth Method</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 capitalize">
                    {user.authProvider || 'email'} Provider
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Account Verification</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Verified User
                  </span>
                </div>
              </div>

              {user.authProvider === 'email' ? (
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    <span>Change Password</span>
                  </h4>

                  {passwordError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
                      {passwordSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition"
                  >
                    Update Password
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-indigo-600 dark:text-cyan-400">Google OAuth Account</p>
                  <p>Your account is linked to Google OAuth. Password and security credentials are managed safely via your Google account.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Permanent Account Deletion</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Deleting your account will permanently remove your user profile, saved local workspace preferences, and authentication credentials from this device.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeleteModal();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-500/20 btn-interactive transition flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Delete Account Permanently</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
