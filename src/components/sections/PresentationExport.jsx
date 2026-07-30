import React, { useState } from 'react';
import { Printer, Download, CheckCircle2, Presentation, FileText, Code, ChevronDown } from 'lucide-react';
import { exportToMarkdown, exportToTxt, exportProjectToPDF } from '../../utils/exportHelpers';

export default function PresentationExport({ data }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const slides = data?.pitch_deck_outline || [];
  const title = data?.title || 'Synapse.ai Project Research Plan';

  const handlePrint = () => {
    exportProjectToPDF(data);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between no-print">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Presentation className="w-4 h-4 text-indigo-600 dark:text-brand-400" />
          <span>Documentation & Report Exporter</span>
        </h3>

        {/* Multi-Format Exporter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition btn-interactive"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 py-1.5 space-y-0.5">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handlePrint();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Printer className="w-3.5 h-3.5 text-rose-500" />
                <span>Download PDF (.pdf)</span>
              </button>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  exportToMarkdown(data);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Code className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                <span>Download Markdown (.md)</span>
              </button>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  exportToTxt(data);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>Download Text (.txt)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl animate-slide-up print:bg-white print:text-black print:p-0 print:border-none">
        <div className="border-b border-slate-200 dark:border-slate-800 print:border-slate-300 pb-3">
          <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest print:text-blue-600">
            Synapse.ai Executive Brief
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white print:text-black mt-0.5">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2 animate-slide-up ${
                idx % 2 === 1 ? 'delay-75' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-brand-500/20 text-indigo-700 dark:text-brand-300 font-bold font-mono text-xs flex items-center justify-center border border-indigo-200 dark:border-brand-500/30 print:bg-blue-100 print:text-blue-700">
                  {slide.slide_number || idx + 1}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200 print:text-slate-900">{slide.title}</h4>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 print:text-slate-700">
                {(slide.bullet_points || []).map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 print:text-blue-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
