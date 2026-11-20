import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquareHeart, 
  Send, 
  ArrowRight, 
  Bot, 
  User, 
  Wind, 
  Compass, 
  FileText, 
  Loader2
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

  const actionIcon = (type: string) => {
    if (type === 'community') return <Compass className="h-3.5 w-3.5" aria-hidden="true" />;
    if (type === 'article') return <FileText className="h-3.5 w-3.5" aria-hidden="true" />;
    if (type === 'breathing') return <Wind className="h-3.5 w-3.5" aria-hidden="true" />;
    return <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />;
  };

  return (
    <section className="panel flex h-[700px] flex-col overflow-hidden" aria-labelledby="companion-heading">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-100 text-forest-700" aria-hidden="true">
            <MessageSquareHeart className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="companion-heading" className="text-base font-semibold tracking-tight">Beacon Companion</h1>
              <span className="chip hidden sm:inline-flex">Uses your recent check-ins</span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded, non-judgmental perspective — not a replacement for professional care.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-forest-500" aria-hidden="true"></span>
          <span>Context: live patterns</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && !isSending && (
          <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-600">
              Say what's on your mind — a hard day, a decision, a spiral. Your recent check-in context is attached automatically.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isUser ? 'bg-slate-200 text-slate-600' : 'bg-forest-100 text-forest-700'
                }`}
                aria-hidden="true"
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>

              <div
                className={`max-w-[82%] rounded-xl p-3.5 text-sm leading-relaxed sm:max-w-[75%] ${
                  isUser
                    ? 'rounded-tr-none bg-forest-600 text-white'
                    : 'rounded-tl-none border border-slate-200 bg-slate-100 text-slate-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Suggested action */}
                {!isUser && msg.suggestedAction && (
                  <div className="mt-2.5 border-t border-slate-200 pt-2.5">
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.suggestedAction!)}
                      className="btn btn-sm btn-outline"
                    >
                      {actionIcon(msg.suggestedAction.type)}
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  </div>
                )}

                <span className={`mt-1.5 block text-[10px] ${isUser ? 'text-forest-100' : 'text-slate-400'} ${isUser ? 'text-right' : ''}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-500" role="status">
            <Loader2 className="h-4 w-4 animate-spin text-forest-600" aria-hidden="true" />
            <span>Beacon is writing a reply…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50 px-4 py-2.5">
        {QUICK_PROMPTS.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="btn btn-sm btn-outline shrink-0 rounded-full whitespace-nowrap normal-case"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3 sm:p-4"
      >
        <label htmlFor="companion-input" className="sr-only">Message Beacon Companion</label>
        <input
          id="companion-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Talk freely — or describe what you're feeling right now…"
          className="field"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="btn btn-primary shrink-0"
          title="Send message"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
};
