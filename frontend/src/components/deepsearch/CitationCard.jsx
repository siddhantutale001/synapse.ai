import React, { useState } from 'react';
import { ExternalLink, Bookmark, Check, BookOpen, Github, MessageSquare, Database, ShieldCheck } from 'lucide-react';

export default function CitationCard({ citation }) {
  const [saved, setSaved] = useState(false);

  const getSourceBadge = (type) => {
    switch (type) {
      case 'PAPER':
        return { label: 'IEEE / arXiv Paper', icon: BookOpen, color: 'bg-[#EEE8FF] text-[#5B48D9] border-[#EEE8FF]' };
      case 'GITHUB':
        return { label: 'GitHub Repository', icon: Github, color: 'bg-[#EEF0F5] text-[#3A4152] border-[#EEF0F5]' };
      case 'DATASET':
        return { label: 'Dataset Registry', icon: Database, color: 'bg-[#D9F9EE] text-[#0F8F6B] border-[#D9F9EE]' };
      default:
        return { label: 'Tech Forum / Article', icon: MessageSquare, color: 'bg-[#FFE3DA] text-[#C8461F] border-[#FFE3DA]' };
    }
  };

  const badge = getSourceBadge(citation.type);
  const Icon = badge.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E6E8F5] hover:border-[#8C5CFF]/40 transition shadow-xs space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className={`inline-flex items-center space-x-1 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
            <Icon className="w-3 h-3" />
            <span>{badge.label}</span>
          </span>
          <h4 className="font-display font-bold text-base text-[#12162A] leading-snug">{citation.title}</h4>
          <p className="text-xs text-[#9198B0]">Authors: {citation.authors?.join(', ')}</p>
        </div>

        <button
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-xl transition border ${
            saved
              ? 'bg-[#D9F9EE] text-[#0F8F6B] border-[#0F8F6B]/30'
              : 'bg-[#F5F6FD] text-[#9198B0] border-[#E6E8F5] hover:text-[#12162A]'
          }`}
          title={saved ? 'Saved to workspace' : 'Save to workspace'}
        >
          {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-xs text-[#5B6178] leading-relaxed bg-[#F5F6FD] p-3 rounded-xl border border-[#E6E8F5]">
        "{citation.snippet}"
      </p>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-[#0F8F6B] bg-[#D9F9EE] px-2 py-0.5 rounded-md font-semibold">
            <ShieldCheck className="w-3 h-3" />
            <span>[{citation.id || '1'}] verified</span>
          </span>
          <span className="text-[11px] font-mono text-[#5B6178]">
            Relevance: <strong className="text-[#12162A]">{(citation.relevanceScore * 100).toFixed(0)}%</strong>
          </span>
        </div>

        <a
          href={citation.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#FF5A3C] hover:text-[#FF5A3C]/80 transition"
        >
          <span>{citation.source}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
