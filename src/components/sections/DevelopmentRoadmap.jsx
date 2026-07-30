import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { MapPin, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

export default function DevelopmentRoadmap({ data, onUpdateRoadmap }) {
  const steps = data?.action_roadmap || [];
  const { broadcastRoadmapToggle } = useSocket();
  const [localSteps, setLocalSteps] = useState(steps);

  const toggleStep = (stepNumber) => {
    const updated = localSteps.map((s) => {
      if (s.step_number === stepNumber) {
        const newCompleted = !s.completed;
        broadcastRoadmapToggle(stepNumber, newCompleted);
        return { ...s, completed: newCompleted };
      }
      return s;
    });
    setLocalSteps(updated);
    if (onUpdateRoadmap) onUpdateRoadmap(updated);
  };

  const completedCount = localSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / (localSteps.length || 1)) * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Development Roadmap</span>
        </h3>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            {completedCount}/{localSteps.length} ({progressPercent}%)
          </div>
          <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {localSteps.map((step, idx) => (
          <div
            key={step.step_number}
            onClick={() => toggleStep(step.step_number)}
            className={`p-4 rounded-2xl ios-glass glass-shimmer border transition cursor-pointer flex items-start gap-3 shadow-sm btn-interactive animate-slide-up ${
              idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
            } ${
              step.completed
                ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="pt-0.5">
              {step.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Step 0{step.step_number}
                </span>
                <h4 className={`text-xs font-bold ${step.completed ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                  {step.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
            </div>

            {step.completed && (
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
