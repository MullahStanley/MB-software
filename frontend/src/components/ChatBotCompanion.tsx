import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquareHeart, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShieldAlert, 
  Wind, 
  Compass, 
  FileText,
  Activity
} from 'lucide-react';
import { api, ChatMessage } from '../api';

interface ChatBotCompanionProps {
  onTriggerThreshold: (level: number, details?: string) => void;
  onNavigateTab: (tab: string) => void;
}

const QUICK_PROMPTS = [
  "I'm feeling intense imposter syndrome today.",
  "I think I'm having a panic attack, chest is tight.",
  "I feel like I'm falling behind everyone in life.",
  "Work stress is leaking into my Sunday night.",
  "Give me a 2-minute nervous system reset."
];

export const ChatBotCompanion: React.FC<ChatBotCompanionProps> = ({ onTriggerThreshold, onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const loadChat = async () => {
    try {
      const msgs = await api.getChatHistory();
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setInputText('');
    setIsSending(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.sendChatMessage(text);
      if (res.assistantMessage) {
        setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), res.userMessage, res.assistantMessage]);

        // If distress level detected is 4 or higher, prompt emergency threshold
        if (res.distressLevel && res.distressLevel >= 4) {
          onTriggerThreshold(res.distressLevel, 'Triggered by Beacon Companion detection');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedAction']>) => {
    if (action.type === 'community') onNavigateTab('communities');
    else if (action.type === 'article') onNavigateTab('articles');
    else if (action.type === 'breathing') onNavigateTab('calm');
    else if (action.type === 'trusted_contacts' || action.type === 'specialist') {
      onTriggerThreshold(action.type === 'specialist' ? 5 : 4);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[700px] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950/50 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Beacon Companion</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                Linked to Biometric Patterns
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded, non-judgmental perspective informed by your recent check-ups
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>Context: Live Patterns Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-850 text-slate-200 border border-slate-750 rounded-tl-none space-y-2.5'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Suggested Action Pill if AI returned one */}
                {!isUser && msg.suggestedAction && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleActionClick(msg.suggestedAction!)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all text-xs font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-2 text-xs text-teal-400">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Beacon Companion is formulating grounded response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex space-x-2 overflow-x-auto scrollbar-none">
        {QUICK_PROMPTS.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="text-[11px] px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Talk freely with Beacon Companion... (or type distress keywords to test safety protocols)"
          className="flex-1 bg-slate-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white shadow-md transition-all"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
