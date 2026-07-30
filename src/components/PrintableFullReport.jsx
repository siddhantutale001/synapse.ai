import React from 'react';
import ProblemValidation from './sections/ProblemValidation';
import MarketResearch from './sections/MarketResearch';
import ComparisonMatrix from './sections/ComparisonMatrix';
import InnovationGaps from './sections/InnovationGaps';
import ProjectArchitecture from './sections/ProjectArchitecture';
import DevelopmentRoadmap from './sections/DevelopmentRoadmap';
import TechStack from './sections/TechStack';
import GitHubRepos from './sections/GitHubRepos';
import APIsAndDatasets from './sections/APIsAndDatasets';
import ImplementationTimeline from './sections/ImplementationTimeline';
import PresentationExport from './sections/PresentationExport';
import { Sparkles } from 'lucide-react';

export default function PrintableFullReport({ workspace }) {
  if (!workspace) return null;

  return (
    <div className="printable-report max-w-5xl mx-auto space-y-10 p-4 text-slate-900 bg-white">
      {/* Document Cover Header */}
      <div className="border-b-2 border-indigo-600 pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Synapse<span className="text-indigo-600">.ai</span>
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300">
                Complete Detailed Project Report v2.0
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <p><strong>Share Code:</strong> {workspace.shareCode || 'SYNC-7788'}</p>
            <p><strong>Export Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          {workspace.title}
        </h2>
        <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
          <strong className="text-slate-900 uppercase font-mono tracking-wider">Raw Research / Project Concept:</strong>
          <p className="mt-1 font-sans text-sm text-slate-800">{workspace.rawIdea}</p>
        </div>
      </div>

      {/* All 11 Sections */}
      <div className="space-y-12">
        <section className="print-section space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 01</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Problem Validation & Market Demand
            </h3>
          </div>
          <ProblemValidation data={workspace} />
        </section>

        <section className="print-section print-page-break space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 02</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Market Research & Competitor Landscape
            </h3>
          </div>
          <MarketResearch data={workspace} />
        </section>

        <section className="print-section space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 03</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Feature Comparison Matrix
            </h3>
          </div>
          <ComparisonMatrix data={workspace} />
        </section>

        <section className="print-section print-page-break space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 04</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Innovation Gaps & Competitive Moat
            </h3>
          </div>
          <InnovationGaps data={workspace} />
        </section>

        <section className="print-section space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 05</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              System Architecture & Data Flow
            </h3>
          </div>
          <ProjectArchitecture data={workspace} />
        </section>

        <section className="print-section print-page-break space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 06</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Development Roadmap & Core Features
            </h3>
          </div>
          <DevelopmentRoadmap data={workspace} />
        </section>

        <section className="print-section space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 07</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Recommended Technology Stack
            </h3>
          </div>
          <TechStack data={workspace} />
        </section>

        <section className="print-section print-page-break space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 08</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Open-Source GitHub Repositories & Starter Kits
            </h3>
          </div>
          <GitHubRepos data={workspace} />
        </section>

        <section className="print-section space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 09</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              APIs, Public Datasets & Integration Specs
            </h3>
          </div>
          <APIsAndDatasets data={workspace} />
        </section>

        <section className="print-section print-page-break space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 10</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Implementation Timeline & Milestones
            </h3>
          </div>
          <ImplementationTimeline data={workspace} />
        </section>

        <section className="print-section space-y-3">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-bold">SECTION 11</span>
            <h3 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">
              Pitch Deck Summary & Key Takeaways
            </h3>
          </div>
          <PresentationExport data={workspace} />
        </section>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-slate-300 text-center text-xs text-slate-500 font-mono">
        <p>Generated automatically by Synapse.ai Research Copilot • End of Project Report</p>
      </div>
    </div>
  );
}
