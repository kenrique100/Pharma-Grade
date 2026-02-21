"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface ChatMsg {
  id: string;
  sessionId: string;
  userEmail: string;
  userName: string;
  from: "user" | "admin";
  text: string;
  timestamp: string;
}

interface ChatSession {
  sessionId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMsg[];
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) setSessions(await res.json());
    } catch {/* ignore */}
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, selected]);

  const activeSession = sessions.find((s) => s.sessionId === selected);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selected, text: replyText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      setReplyText("");
      toast.success("Reply sent!");
      await fetchSessions();
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Live <span className="text-red-600">Chat</span>
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">— {sessions.length} active conversation{sessions.length !== 1 ? "s" : ""}</span>
      </h1>

      {sessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400">No chat messages yet. Users will appear here when they send a message from the support page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
          {/* Sessions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-900 dark:text-white font-semibold text-sm">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {sessions.map((s) => (
                <button
                  key={s.sessionId}
                  onClick={() => setSelected(s.sessionId)}
                  className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${selected === s.sessionId ? "bg-red-50 dark:bg-red-900/20 border-l-2 border-l-red-600" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900 dark:text-white font-medium text-sm truncate">{s.userName}</span>
                    <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{new Date(s.lastTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {s.userEmail && <p className="text-gray-400 text-xs mb-1 truncate">{s.userEmail}</p>}
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{s.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {!activeSession ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Select a conversation to view messages</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">{activeSession.userName}</div>
                  {activeSession.userEmail && <div className="text-gray-400 text-xs">{activeSession.userEmail}</div>}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeSession.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 text-sm ${
                        msg.from === "admin"
                          ? "bg-red-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}>
                        <div className="text-xs mb-0.5 opacity-70">{msg.from === "admin" ? "You (Support)" : msg.userName}</div>
                        {msg.text}
                        <div className="text-xs mt-1 opacity-60">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleReply} className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                    placeholder="Type your reply..."
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !replyText.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                    {sending ? "..." : "Reply"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
