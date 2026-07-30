import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { user, deleteAccount } = useAuth();
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleDelete = (e) => {
    e.preventDefault();
    setError('');

    if (confirmInput.trim().toUpperCase() !== 'DELETE') {
      setError('Please type DELETE to confirm account removal.');
      return;
    }

    deleteAccount();
    setIsDeleted(true);
    setTimeout(() => {
      setIsDeleted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-rose-500/30 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Confirm Permanent Account Deletion</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isDeleted ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Account Deleted</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your account data has been completely erased from storage.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDelete} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{user.name}</span> ({user.email})? This action cannot be undone.
              </p>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type <span className="font-mono text-rose-500 font-bold">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  required
                  placeholder="DELETE"
                  value={confirmInput}
                  onChange={(e) => {
                    setConfirmInput(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-500/20 btn-interactive transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Deletion</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
