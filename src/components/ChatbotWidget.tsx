import { useEffect, useRef, useState, FormEvent } from 'react';
import { ArrowUpRight, MessageCircle, Send, X } from 'lucide-react';
import type { ChatMessage, PortalId } from '../types/portal';

interface ChatbotWidgetProps {
  activePortal: PortalId;
  onNavigatePortal: (portal: PortalId) => void;
  externalOpenPrompt: string | null;
  onClearExternalPrompt: () => void;
}

const INITIAL_SUGGESTIONS = [
  'Take me to the Admission Portal',
  'Check hostel bed availability',
  'Show 2026 placement details',
];

export function ChatbotWidget({
  activePortal,
  onNavigatePortal,
  externalOpenPrompt,
  onClearExternalPrompt,
}: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Welcome to Sri Krishna Arts and Science College. Ask me about admissions, placements, faculty study backgrounds, hostel availability, or tell me which portal you want to visit.',
      suggestedQuestions: INITIAL_SUGGESTIONS,
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          currentPortal: activePortal,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            text: data.error || 'I encountered an issue answering that. Please try asking again.',
          },
        ]);
      } else {
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          navigateToPortal: data.navigateToPortal ?? null,
          navigateLabel: data.navigateLabel ?? null,
          suggestedQuestions: data.suggestedQuestions ?? [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'Connection interrupted. You can still use the portal bar at the top to browse every section.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (externalOpenPrompt) {
      setOpen(true);
      sendMessage(externalOpenPrompt);
      onClearExternalPrompt();
    }
  }, [externalOpenPrompt]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleNavigate = (portal: PortalId) => {
    onNavigatePortal(portal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Guide Trigger */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open SKASC Campus Guide Chatbot"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 px-4 py-3 bg-[#1E3A8A] hover:bg-[#172554] text-[#FBF9F5] rounded-md shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide">Campus Guide</span>
        </button>
      )}

      {/* Slide-over Chatbot Panel */}
      {open && (
        <aside
          aria-label="SKASC Campus Navigation Assistant"
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[540px] max-h-[82vh] bg-[#FBF9F5] border border-[#D6CEBE] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#1C1917] text-[#FBF9F5] flex items-center justify-between gap-4">
            <div>
              <p className="font-serif text-base font-semibold">SKASC Navigation Guide</p>
              <p className="text-[11px] text-[#D6CEBE]">Ask questions or jump directly to any portal</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Campus Guide"
              className="w-8 h-8 inline-flex items-center justify-center rounded text-[#D6CEBE] hover:text-[#FBF9F5] hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1E3A8A] text-[#FBF9F5]'
                      : 'bg-[#F4F0E8] border border-[#E5DFD5] text-[#1C1917]'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.navigateToPortal && (
                    <button
                      type="button"
                      onClick={() => handleNavigate(msg.navigateToPortal as PortalId)}
                      className="mt-3 w-full inline-flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524] transition-colors cursor-pointer"
                    >
                      <span>{msg.navigateLabel || `Go to ${msg.navigateToPortal}`}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>

                {msg.role === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="text-left px-2.5 py-1 text-[11px] font-medium bg-[#FBF9F5] border border-[#D6CEBE] text-[#44403C] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="text-xs text-[#78716C] px-1">Searching SKASC portals...</div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#E5DFD5] bg-[#F4F0E8] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about admissions, hostel, faculty..."
              className="flex-1 px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="px-3.5 py-2 bg-[#1E3A8A] text-[#FBF9F5] hover:bg-[#172554] disabled:opacity-50 rounded-md inline-flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
