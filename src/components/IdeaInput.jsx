import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { presetIdeas } from '../data/fallbackData';
import { Sparkles, ArrowRight, Lightbulb, Upload, FileText, Image as ImageIcon, X, Radio } from 'lucide-react';

export default function IdeaInput({ onGenerate, loading }) {
  const [ideaText, setIdeaText] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useLanguage();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles) => {
    const validFiles = newFiles.filter((f) => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext);
    });

    const filePromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type.includes('pdf') ? 'pdf' : 'image',
            content: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((processed) => {
      setFiles((prev) => [...prev, ...processed]);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    processFiles(droppedFiles);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!ideaText.trim() && files.length === 0) || loading) return;
    onGenerate(ideaText.trim(), files);
  };

  const handleSelectPreset = (preset) => {
    setIdeaText(preset.idea);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="relative rounded-3xl ios-glass glass-shimmer p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              AI Research & Innovation Engine
            </h2>
          </div>
        </div>

        {/* Loading Radar Wave Indicator */}
        {loading && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center space-y-2 animate-pulse">
            <div className="flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs">
              <Radio className="w-4 h-4 text-cyan-500 animate-spin" />
              <span>SYNTHESIZING RESEARCH PLAN...</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-indigo-200 dark:bg-indigo-900 overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 w-full animate-shimmer"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Describe your research or project idea in detail..."
              className="w-full p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner resize-none"
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 font-mono">
              {ideaText.length} chars
            </div>
          </div>

          {/* iOS File Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center gap-1.5 btn-interactive ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              multiple
              className="hidden"
            />
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Attach Research PDFs or Images (.pdf, .png, .jpg, .webp)</span>
            </div>
            <span className="text-[10px] text-slate-400">Drag & drop files or click to browse</span>
          </div>

          {/* Uploaded File Badges */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono shadow-sm"
                >
                  {file.type === 'pdf' ? (
                    <FileText className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                  )}
                  <span className="truncate max-w-[160px] font-sans font-medium">{file.name}</span>
                  <span className="text-[10px] text-slate-400">({file.size})</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Presets</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetIdeas.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-xs flex items-center justify-between group btn-interactive"
                >
                  <span className="font-medium truncate">{preset.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-brand-400 transition transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || (!ideaText.trim() && files.length === 0)}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all btn-interactive ${
                loading || (!ideaText.trim() && files.length === 0)
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Generate Research Plan {files.length > 0 ? `(${files.length} Attachments)` : ''}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
