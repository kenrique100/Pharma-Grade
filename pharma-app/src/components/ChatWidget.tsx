"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface ChatMsg {
  id: string;
  from: "user" | "admin";
  text: string;
  timestamp: string;
}

const WELCOME_MSG: ChatMsg = {
  id: "welcome",
  from: "admin",
  text: "👋 Hello! Welcome to Pharma Grade support. How can I help you today?",
  timestamp: new Date(0).toISOString(),
};

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getOrCreateSessionId() {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("chat_session_id");
  if (!sid) {
    sid = generateSessionId();
    localStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

export default function ChatWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [unread, setUnread] = useState(0);
  const lastSeenCountRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Fetch messages when open
  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        if (res.ok) {
          const data: ChatMsg[] = await res.json();
          const msgs = data.length > 0 ? data : [WELCOME_MSG];
          setMessages(msgs);
          if (!open) {
            // Only count admin messages received since we last opened the chat
            const adminCount = data.filter((m) => m.from === "admin").length;
            const newCount = Math.max(0, adminCount - lastSeenCountRef.current);
            setUnread(newCount);
          }
        }
      } catch {
        /* ignore */
      }
    };

    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId, open]);

  // Clear unread when opened; record seen count
  useEffect(() => {
    if (open) {
      setUnread(0);
      const adminCount = messages.filter((m) => m.from === "admin").length;
      lastSeenCountRef.current = adminCount;
    }
  }, [open, messages]);

  // Auto-scroll
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleClose = async () => {
    setOpen(false);
    // Delete chat history from DB and reset local session
    if (sessionId) {
      try {
        await fetch(`/api/chat?sessionId=${sessionId}`, { method: "DELETE" });
      } catch {
        /* ignore */
      }
      localStorage.removeItem("chat_session_id");
      const newSid = generateSessionId();
      localStorage.setItem("chat_session_id", newSid);
      setSessionId(newSid);
      setMessages([]);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    const userEmail = session?.user?.email ?? "";
    const userName = session?.user?.name ?? "Guest";

    const tempMsg: ChatMsg = { id: `tmp_${Date.now()}`, from: "user", text, timestamp: new Date().toISOString() };
    setMessages((prev) => {
      const withoutWelcome = prev.filter((m) => m.id !== "welcome");
      return [...withoutWelcome, tempMsg];
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text, userEmail, userName }),
      });
      if (!res.ok) throw new Error("Failed to send");
      if (!userEmail) {
        toast("💡 Sign in so our team can email you when we reply!", { icon: "ℹ️" });
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => {
        const without = prev.filter((m) => m.id !== tempMsg.id);
        return without.length === 0 ? [WELCOME_MSG] : without;
      });
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:outline-none"
        aria-label="Open live chat"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold text-sm">Support — Online 24/7</span>
            </div>
            <button
              onClick={handleClose}
              className="text-red-200 hover:text-white transition-colors text-xs underline"
              title="Close and clear chat"
            >
              Close &amp; clear
            </button>
          </div>

          {!session && (
            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-700 dark:text-yellow-400 text-xs">
                💡{" "}
                <a href="/login" className="underline font-medium">
                  Sign in
                </a>{" "}
                so our team can email you when they reply.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900 max-h-72">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    msg.from === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                  <div className={`text-xs mt-0.5 ${msg.from === "user" ? "text-red-200" : "text-gray-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              placeholder="Type a message…"
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold px-3 py-2 rounded-lg transition-colors text-sm"
            >
              {sending ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
