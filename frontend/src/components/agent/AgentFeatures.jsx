import React from 'react';
import { Bell, Zap, HelpCircle, ShieldCheck } from 'lucide-react';

export default function AgentFeatures() {
  const features = [
    { title: 'Automated Daily Nudges', desc: 'Receive morning notifications on pending milestones and research deadlines.', icon: Bell },
    { title: 'Instant Paper Summaries', desc: 'Ask the bot for quick paper summaries and arXiv DOI link validation.', icon: Zap },
    { title: 'Q&A Research Copilot', desc: 'Query machine learning architecture details and tech stack recommendations.', icon: HelpCircle },
    { title: 'Encrypted Cloud Pairing', desc: 'Secure 6-digit deep-link code pairing with Cloud Firestore sync.', icon: ShieldCheck }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6E8F5] space-y-4 shadow-xs">
      <h4 className="font-display font-bold text-base text-[#12162A]">Companion Bot Capabilities</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-[#F5F6FD] p-4 rounded-xl border border-[#E6E8F5] space-y-1">
              <div className="flex items-center space-x-2 text-[#0F8F6B]">
                <Icon className="w-4 h-4" />
                <h5 className="font-bold text-xs text-[#12162A]">{f.title}</h5>
              </div>
              <p className="text-[11px] text-[#5B6178] leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
