import React, { useState, useRef } from 'react';
import { Sparkles, Paperclip, ArrowRight, FileText, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { validateUploadFile } from '../../utils/fileValidation.js';

export default function IdeaHero() {
  const { createWorkspace, loading, researchProgress } = useWorkspace();
  const [title, setTitle] = useState('');
  const [rawIdea, setRawIdea] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    setUploadError('');
    const files = Array.from(e.target.files);
    const newValidFiles = [];

    for (const file of files) {
      const result = validateUploadFile(file);
      if (!result.valid) {
        setUploadError(result.error);
        return;
      }
      newValidFiles.push(file);
    }

    setAttachedFiles(prev => [...prev, ...newValidFiles]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'Autonomous AI Navigation System';
    const finalIdea = rawIdea.trim() || 'Build an AI model for real-time computer vision navigation and obstacle avoidance in complex environments';
    createWorkspace(finalTitle, finalIdea);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="text-center space-y-3 py-6">
        <span className="inline-flex items-center space-x-1.5 bg-[#FFE3DA] text-[#FF5A3C] border border-[#FF5A3C]/30 px-3.5 py-1 rounded-full text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A3C]" />
          <span>Layer 2 AI Pipeline Engine</span>
        </span>
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-[#12162A] tracking-tight">
          Search less. <span className="bg-gradient-to-r from-[#FF5A3C] to-[#8C5CFF] bg-clip-text text-transparent">Solve more.</span>
        </h1>
        <p className="text-sm text-[#5B6178] max-w-2xl mx-auto leading-relaxed">
          Enter any research idea or engineering concept. Synapse.AI automatically generates verifiable paper citations, groups state-of-the-art solution matrices, and builds your Project HUB execution roadmap.
        </p>
      </div>

      {/* Live Research Progress Overlay Panel */}
      {loading && (
        <div className="bg-white p-6 rounded-2xl border border-[#8C5CFF]/40 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <RefreshCw className="w-5 h-5 text-[#FF5A3C] animate-spin" />
              <div>
                <h3 className="font-display font-bold text-sm text-[#12162A]">Deep Scientific Research in Progress...</h3>
                <p className="text-xs text-[#5B6178]">Analyzing problem space & resolving real arXiv and GitHub links</p>
              </div>
            </div>
            <span className="font-mono text-xs text-[#0F8F6B] font-bold bg-[#D9F9EE] px-2.5 py-1 rounded-lg">
              {researchProgress?.percent || 20}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2.5 bg-[#F5F6FD] rounded-full overflow-hidden border border-[#E6E8F5]">
            <div
              className="h-full bg-gradient-to-r from-[#FF5A3C] via-[#8C5CFF] to-[#00D3A0] transition-all duration-500 rounded-full"
              style={{ width: `${researchProgress?.percent || 20}%` }}
            />
          </div>

          {/* Stage Log Feed */}
          <div className="bg-[#0D0F2B] p-3.5 rounded-xl border border-[#272E63] font-mono text-xs text-white space-y-1.5 shadow-inner">
            <div className="flex items-center space-x-2 text-[#00D3A0]">
              <span className="animate-pulse">▸</span>
              <span>{researchProgress?.message || 'Initiating DeepSearch & querying arXiv databases...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Idea Prompt Input Form Container */}
      <div className="relative bg-white p-6 md:p-8 rounded-2xl border border-[#E6E8F5] shadow-sm space-y-5 overflow-hidden">
        {/* Subtle Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,90,60,0.12) 0%, transparent 70%)' }} 
        />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1.5 tracking-wider">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Autonomous AI Drone Navigation System"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-4 py-3 text-sm text-[#12162A] placeholder-[#9198B0] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1.5 tracking-wider">One-Line Student Idea</label>
            <textarea
              rows={3}
              placeholder="Build an AI model for real-time computer vision navigation and obstacle avoidance in complex environments..."
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-4 py-3 text-sm text-[#12162A] placeholder-[#9198B0] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition leading-relaxed"
              required
            />
          </div>

          {/* File Upload Controls & Actions */}
          <div className="space-y-3 pt-2 border-t border-[#E6E8F5]/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx,.doc,.csv"
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-[#F5F6FD] hover:bg-[#E6E8F5] border border-[#E6E8F5] text-xs font-mono text-[#12162A] flex items-center space-x-2 transition shadow-xs"
                >
                  <Paperclip className="w-3.5 h-3.5 text-[#00D3A0]" />
                  <span>Attach File (Max 10MB)</span>
                </button>
              </div>

              <button
                id="analyze-idea-btn"
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#FF5A3C] to-[#8C5CFF] hover:from-[#FF5A3C]/90 hover:to-[#8C5CFF]/90 text-white font-display font-semibold px-6 py-3 rounded-xl text-sm transition shadow-md shadow-[#FF5A3C]/20 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Analyze idea</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Upload Error Alert Banner */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-[#FFE3DA] border border-[#FF5A3C]/40 text-[#FF5A3C] text-xs flex items-center space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Attached File Chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {attachedFiles.map((file, i) => (
                  <span key={i} className="inline-flex items-center space-x-1.5 text-xs bg-[#F5F6FD] text-[#12162A] px-3 py-1.5 rounded-xl border border-[#E6E8F5] shadow-xs">
                    <FileText className="w-3.5 h-3.5 text-[#00D3A0]" />
                    <span className="max-w-[160px] truncate font-medium">{file.name}</span>
                    <span className="text-[10px] text-[#9198B0] font-mono">({(file.size / 1024).toFixed(0)}KB)</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-[#9198B0] hover:text-[#FF5A3C] transition ml-1 text-sm font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
