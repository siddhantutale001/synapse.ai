import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function IntroSplash({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit transition after 1.5 seconds automatically
    const timer = setTimeout(() => {
      setExiting(true);
    }, 1500);

    // Complete splash transition after 2.1 seconds total
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2100);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19] text-white transition-all duration-700 ease-in-out ${
        exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background particle glow */}
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse pointer-events-none -top-10 -left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none -bottom-10 -right-10"></div>
      <div className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-5 px-4">
        {/* Animated Glowing Logo */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-cyber-purple to-cyber-cyan p-1 shadow-2xl shadow-indigo-500/40 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Title Reveal */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300">
            Synapse<span className="text-brand-500">.ai</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-400 font-semibold">
            Innovation Engine
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 via-cyber-purple to-cyber-cyan w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
