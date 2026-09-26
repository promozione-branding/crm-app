// src/app/dashboard/components/DashboardAIChat.jsx

'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, X, Send, Loader2, MessageSquare, Bot, User as UserIcon } from 'lucide-react';

// ============================================================
// SUGGESTIONS (quick prompts shown on empty chat)
// ============================================================

const QUICK_PROMPTS = [
    'Which leads should I focus on today?',
    'Which leads are going cold?',
    'Summarize my call activity.',
    'What is my total pipeline value?',
];

// ============================================================
// STRIP MARKDOWN (defensive)
// ============================================================

function stripMarkdown(text) {
    if (!text) return '';

    return (
        text
            // **bold** or __bold__
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            // *italics* or _italics_
            .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1$2')
            .replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1$2')
            // `code`
            .replace(/`([^`]+)`/g, '$1')
            // ### headings
            .replace(/^#{1,6}\s+/gm, '')
            // Lines starting with "- ", "* ", "• ", or "1. "
            .replace(/^\s*[-*•]\s+/gm, '')
            .replace(/^\s*\d+\.\s+/gm, '')
            // Collapse 3+ newlines into 2
            .replace(/\n{3,}/g, '\n\n')
            .trim()
    );
}

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardAIChat() {
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi 👋 I'm your CRM AI. Ask me anything about your leads, calls, or tasks.",
        },
    ]);

    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);

    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open, sending]);

    // ========================================================
    // SEND MESSAGE
    // ========================================================

    const send = async (textOverride) => {
        const text = (textOverride ?? input).trim();
        if (!text || sending) return;

        const nextMessages = [...messages, { role: 'user', content: text }];

        setMessages(nextMessages);
        setInput('');
        setSending(true);

        try {
            const res = await axios.post(
                '/api/user/dashboard/ai-chat',
                {
                    // Send only role + content, skip the first greeting
                    messages: nextMessages.slice(1).map(({ role, content }) => ({ role, content })),
                },
                { withCredentials: true }
            );

            if (res.data?.success) {
                setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.reply }]);
            } else {
                toast.error(res.data?.message || 'AI failed to reply.');
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'AI failed to reply.');
        } finally {
            setSending(false);
        }
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <>
            {/* ==============================================
                FLOATING BUTTON
            ============================================== */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed right-4 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition hover:bg-violet-700 active:scale-95 sm:right-5 sm:bottom-5"
                    aria-label="Open AI chat"
                >
                    <MessageSquare size={22} />
                </button>
            )}

            {/* ==============================================
                CHAT PANEL
            ============================================== */}
            {open && (
                <div className="bg-app border-app fixed right-4 bottom-20 z-50 flex h-[min(560px,75vh)] w-[min(400px,92vw)] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:right-5 sm:bottom-5 sm:h-[min(600px,85vh)]">
                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-violet-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <p className="text-sm leading-tight font-semibold">CRM AI</p>
                                <p className="text-[11px] opacity-80">Ask about your leads, calls & tasks</p>
                            </div>
                        </div>

                        <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 transition hover:bg-white/15" aria-label="Close chat">
                            <X size={16} />
                        </button>
                    </div>

                    {/* MESSAGES */}
                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
                        {messages.map((m, i) => (
                            <MessageBubble key={i} role={m.role} content={m.content} />
                        ))}

                        {sending && (
                            <div className="flex items-center gap-2 text-xs opacity-60">
                                <Bot size={13} />
                                <Loader2 size={13} className="animate-spin" />
                                Thinking…
                            </div>
                        )}

                        {/* QUICK PROMPTS (only on first message) */}
                        {messages.length === 1 && !sending && (
                            <div className="pt-2">
                                <p className="mb-2 text-[11px] opacity-60">Try asking:</p>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_PROMPTS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => send(q)}
                                            className="border-app hover-app rounded-full border px-3 py-1.5 text-[11px] transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* INPUT */}
                    <div className="border-t border-white/10 p-2.5">
                        <div className="border-app flex items-end gap-2 rounded-xl border px-3 py-2 transition focus-within:border-violet-500">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        send();
                                    }
                                }}
                                rows={1}
                                placeholder="Ask about your pipeline…"
                                className="max-h-32 flex-1 resize-none bg-transparent text-sm outline-none"
                                disabled={sending}
                            />
                            <button
                                onClick={() => send()}
                                disabled={sending || !input.trim()}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
                                aria-label="Send"
                            >
                                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                            </button>
                        </div>
                        <p className="mt-1.5 px-1 text-[10px] opacity-50">AI may make mistakes. Verify critical info.</p>
                    </div>
                </div>
            )}
        </>
    );
}

// ============================================================
// MESSAGE BUBBLE
// ============================================================

function MessageBubble({ role, content }) {
    const isUser = role === 'user';
    const text = isUser ? content : stripMarkdown(content);

    return (
        <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    isUser ? 'bg-blue-500/15 text-blue-500' : 'bg-violet-500/15 text-violet-500'
                }`}
            >
                {isUser ? <UserIcon size={13} /> : <Bot size={13} />}
            </div>

            <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap ${
                    isUser ? 'bg-blue-600 text-white' : 'border-app border'
                }`}
            >
                {text}
            </div>
        </div>
    );
}
