import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Users, Copy, Check, LogOut, Radio, Share2 } from 'lucide-react';

export default function MultiUserModal({ currentShareCode, onClose }) {
  const { roomCode, collaborators, joinRoom, leaveRoom } = useSocket();
  const [inputCode, setInputCode] = useState(currentShareCode || '');
  const [username, setUsername] = useState('Engineer_' + Math.floor(100 + Math.random() * 900));
  const [copied, setCopied] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    joinRoom(inputCode.trim().toUpperCase(), username);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '?room=' + (roomCode || inputCode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-md ios-glass p-5 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Multi-User Sync</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg btn-interactive"
          >
            ✕
          </button>
        </div>

        {roomCode ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>ROOM CONNECTED</span>
              </div>
              <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white tracking-widest">
                {roomCode}
              </div>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition btn-interactive"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Link Copied' : 'Copy Share Link'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Collaborators ({collaborators.length})
              </span>
              <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto space-y-1.5">
                {collaborators.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No other collaborators connected.</p>
                ) : (
                  collaborators.map((u, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Active</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={leaveRoom}
              className="w-full py-2.5 rounded-2xl bg-rose-50 dark:bg-red-950/60 text-rose-600 dark:text-red-300 border border-rose-200 dark:border-red-900/60 hover:bg-rose-100 dark:hover:bg-red-900/60 text-xs font-bold flex items-center justify-center gap-2 transition btn-interactive"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Room Code</label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="SYNC-7788"
                className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow hover:opacity-90 transition flex items-center justify-center gap-2 btn-interactive"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Join Room</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
