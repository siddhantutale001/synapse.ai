import React, { useState } from 'react';
import { Send, Bot, ExternalLink, Sparkles, CheckCheck } from 'lucide-react';
import api from '../../services/api.js';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';

export default function PhoneMockup() {
  const { activeWorkspace } = useWorkspace();
  const [pairingData, setPairingData] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '👋 Welcome to Synapse.AI Companion Bot! I am paired with your active research workspace.', time: '08:00 AM' },
    { id: 2, sender: 'bot', text: '🚀 Synapse Nudge: Milestone "Phase 2: AI Microservice & Predictive Pipeline" is due today!', time: '08:01 AM' },
    { id: 3, sender: 'user', text: 'What is the recommended ML framework for our pipeline engine?', time: '08:05 AM' },
    { id: 4, sender: 'bot', text: '💡 Based on your research citations, Python FastAPI + PyTorch/LangChain achieved top accuracy and minimal latency.', time: '08:05 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleGeneratePairing = async () => {
    try {
      const res = await api.post('/bot/generate-pairing-code');
      if (res.data?.success) {
        setPairingData(res.data);
      }
    } catch (err) {
      setPairingData({
        pairingCode: '849201',
        telegramDeepLink: 'https://t.me/synapse_ai_copilot_bot?start=849201'
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg) return;
    const userText = inputMsg;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, time: 'Just now' }]);
    setInputMsg('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: `🧠 Synapse Bot: Received query "${userText}". Updating workspace ${activeWorkspace?.workspaceId}...`,
        time: 'Just now'
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Telegram DeepLink Generator Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#00D3A0]/30 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-[#12162A]">Mobile Companion Bot Deep-Link</h4>
          <p className="text-xs text-[#5B6178]">Pair Telegram account for daily milestone nudges</p>
        </div>

        <button
          onClick={handleGeneratePairing}
          className="bg-gradient-to-r from-[#00D3A0] to-[#8C5CFF] hover:from-[#00D3A0]/90 hover:to-[#8C5CFF]/90 text-white font-display font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-[#00D3A0]/20 flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Connect Telegram Bot</span>
        </button>
      </div>

      {pairingData && (
        <div className="p-4 bg-white rounded-xl border border-[#00D3A0]/40 text-center space-y-1 shadow-xs animate-fadeIn">
          <span className="text-xs text-[#9198B0]">Your Telegram 6-Digit Pairing Code</span>
          <div className="text-2xl font-mono font-extrabold text-[#0F8F6B] tracking-widest">{pairingData.pairingCode}</div>
          <a
            href={pairingData.telegramDeepLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-[#FF5A3C] hover:underline mt-1 font-semibold"
          >
            <span>Click to Open Telegram Bot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Phone Mockup in Deep Navy Bezel */}
      <div className="w-full max-w-sm mx-auto bg-[#0B1220] p-4 rounded-[36px] border-4 border-[#272E63] shadow-2xl space-y-3 select-none">
        {/* Phone Speaker Notch */}
        <div className="w-24 h-3 bg-[#1A2338] rounded-full mx-auto mb-2" />

        {/* Chat App Header */}
        <div className="bg-[#151D30] p-3 rounded-2xl flex items-center space-x-3 border border-[#272E63]/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5A3C] to-[#8C5CFF] flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h5 className="font-display font-bold text-xs text-white">Synapse.AI Companion</h5>
            <span className="text-[9px] text-[#00D3A0] font-mono">Telegram Companion Bot</span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="h-72 overflow-y-auto space-y-2.5 p-2 bg-[#080D17] rounded-2xl border border-[#272E63]/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#FF5A3C] text-white ml-auto rounded-tr-none shadow-sm'
                  : 'bg-[#1D2A45] text-[#E4E7F2] mr-auto border border-[#272E63]/60 rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1 opacity-70 text-[9px]">
                <span>{m.time}</span>
                {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-white" />}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a research question..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-[#151D30] border border-[#272E63] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8A90AD] focus:outline-none focus:border-[#00D3A0]"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-[#00D3A0] text-[#0D0F2B] font-bold hover:bg-[#00D3A0]/90 transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
