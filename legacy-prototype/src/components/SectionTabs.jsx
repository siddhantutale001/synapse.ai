import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Search,
  Grid,
  Lightbulb,
  Cpu,
  MapPin,
  Layers,
  Code,
  Database,
  Clock,
  Printer,
} from 'lucide-react';

const sectionList = [
  { id: 'problemValidation', labelKey: 'sections.problemValidation', icon: FileText, badge: '01' },
  { id: 'marketResearch', labelKey: 'sections.marketResearch', icon: Search, badge: '02' },
  { id: 'comparisonMatrix', labelKey: 'sections.comparisonMatrix', icon: Grid, badge: '03' },
  { id: 'innovationGaps', labelKey: 'sections.innovationGaps', icon: Lightbulb, badge: '04' },
  { id: 'architecture', labelKey: 'sections.architecture', icon: Cpu, badge: '05' },
  { id: 'roadmap', labelKey: 'sections.roadmap', icon: MapPin, badge: '06' },
  { id: 'techStack', labelKey: 'sections.techStack', icon: Layers, badge: '07' },
  { id: 'githubRepos', labelKey: 'sections.githubRepos', icon: Code, badge: '08' },
  { id: 'apisDatasets', labelKey: 'sections.apisDatasets', icon: Database, badge: '09' },
  { id: 'timeline', labelKey: 'sections.timeline', icon: Clock, badge: '10' },
  { id: 'presentationExport', labelKey: 'sections.presentationExport', icon: Printer, badge: '11' },
];

export default function SectionTabs({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  return (
    <div className="sticky top-[70px] z-30 w-full px-4 my-2.5 no-print transition-all duration-300">
      <div className="max-w-6xl mx-auto rounded-full bg-white/75 dark:bg-slate-900/75 border border-white/40 dark:border-slate-800/80 backdrop-blur-2xl p-1.5 shadow-lg shadow-indigo-500/5 dark:shadow-black/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {sectionList.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap btn-interactive transition-all duration-300 relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-[1.02] font-bold border border-indigo-400/30'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white border border-white/20'
                    : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700/50'
                }`}
              >
                {sec.badge} / 11
              </span>
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-600 dark:text-cyan-400'}`} />
              <span>{t(sec.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
