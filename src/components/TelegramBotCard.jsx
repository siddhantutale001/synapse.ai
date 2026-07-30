import React, { useState } from 'react';
import { Bot, Send, QrCode, CheckCircle2, MessageSquare } from 'lucide-react';

export default function TelegramBotCard({ onClose }) {
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Bot active. Ask about research papers, citations, or roadmap progress.' }
  ]);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || sending) return;

    const userText = inputMsg.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setSending(true);

    try {
      const res = await fetch('/api/v1/insights/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `🧠 Received idea "${userText}". Multi-user dashboard updated.` }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg ios-glass p-5 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Telegram Companion Bot</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg btn-interactive"
            >
              ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 items-center">
          <div className="flex flex-col items-center justify-center bg-white p-2 rounded-2xl text-center shadow-sm">
            <QrCode className="w-14 h-14 text-slate-900" />
          </div>

          <div className="sm:col-span-2 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>@SynapseAiCopilotBot</span>
            </div>
            <a
              href="https://t.me/SynapseAiCopilotBot"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 pt-1"
            >
              Open in Telegram →
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              Bot Interface
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 h-40 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2 rounded-xl text-xs ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask bot: 'What are the citations?'..."
              className="flex-1 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={sending || !inputMsg.trim()}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow transition btn-interactive"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
