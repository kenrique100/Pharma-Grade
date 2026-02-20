"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const faqs = [
  { q: "How do I pay with cryptocurrency?", a: "At checkout, select your preferred cryptocurrency (BTC, ETH, USDC, or LTC). Send the exact amount to our wallet address displayed and paste your transaction hash to confirm your order. Orders are confirmed after 1 network confirmation." },
  { q: "How long does shipping take?", a: "Standard delivery takes 7-14 business days internationally. Express options (3-7 days) are available at checkout. All orders ship in unmarked, discreet packaging." },
  { q: "How do I track my order?", a: "Once your order ships, you will receive a tracking number via email. You can use this to monitor your shipment through our carrier's website." },
  { q: "Are products lab tested?", a: "Yes — every product is third-party tested for purity and potency. Certificates of Analysis (CoA) are available on request for any product." },
  { q: "Can I return a product?", a: "Due to the nature of our products, we do not accept returns. However, if your order arrives damaged or is not as described, please contact our support team within 48 hours of delivery." },
  { q: "Do you ship to my country?", a: "We ship to most countries worldwide. Some jurisdictions have restrictions on certain compounds. Please check your local regulations before ordering." },
];

interface Ticket {
  id: string;
  subject: string;
  message: string;
  email: string;
  status: "open" | "replied";
  date: string;
  reply?: string;
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "ticket" | "chat">("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: "user" | "support"; text: string }[]>([
    { from: "support", text: "👋 Hello! Welcome to Pharma Grade support. How can I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const newTicket: Ticket = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      subject: form.subject,
      message: form.message,
      email: form.email,
      status: "replied",
      date: new Date().toLocaleDateString(),
      reply: "Thank you for contacting Pharma Grade support! Our team has received your message and will respond to your email within 24 hours. Reference ID: " + Math.floor(10000 + Math.random() * 90000),
    };
    setTickets((prev) => [newTicket, ...prev]);
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
    toast.success("Support ticket submitted! Check your email for confirmation.");
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      const lc = userMsg.toLowerCase();
      let reply = "I've noted your message and will connect you with a team member shortly. For urgent matters, please submit a support ticket.";
      if (lc.includes("order") || lc.includes("track")) reply = "To track your order, please check the email you received at purchase. Your tracking number is included once the order ships.";
      else if (lc.includes("pay") || lc.includes("crypto") || lc.includes("btc") || lc.includes("eth")) reply = "We accept BTC, ETH, USDC, and LTC. At checkout, send the exact amount to the provided wallet address and paste your transaction hash to confirm.";
      else if (lc.includes("ship") || lc.includes("delivery")) reply = "Standard shipping takes 7-14 business days. Express (3-7 days) is available. All shipments are in discreet, unmarked packaging.";
      else if (lc.includes("return") || lc.includes("refund")) reply = "We don't accept returns due to product nature, but if your order was damaged or incorrect, contact us within 48 hours of delivery.";
      else if (lc.includes("lab") || lc.includes("test") || lc.includes("purity")) reply = "All products are third-party lab tested for purity and potency. Certificates of Analysis are available on request.";
      setChatMessages((prev) => [...prev, { from: "support", text: reply }]);
    }, 1000);
  };

  const inputCls = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors";
  const tabCls = (t: string) => `px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === t ? "bg-red-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-950 py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
          Customer <span className="text-red-600">Support</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-2">
          We&apos;re here to help 24/7. Choose how you&apos;d like to reach us.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Average response time: &lt; 2 hours</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button className={tabCls("faq")} onClick={() => setActiveTab("faq")}>❓ FAQ</button>
          <button className={tabCls("ticket")} onClick={() => setActiveTab("ticket")}>📧 Submit Ticket</button>
          <button className={tabCls("chat")} onClick={() => setActiveTab("chat")}>💬 Live Chat</button>
        </div>

        {/* FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-gray-900 dark:text-white font-semibold text-sm">{faq.q}</span>
                  <span className="text-gray-400 ml-4">{expandedFaq === i ? "▲" : "▼"}</span>
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="text-center mt-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Can&apos;t find your answer?{" "}
                <button onClick={() => setActiveTab("ticket")} className="text-red-600 dark:text-red-400 hover:underline font-medium">Submit a ticket</button>
              </p>
            </div>
          </div>
        )}

        {/* Ticket Form */}
        {activeTab === "ticket" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-5">Submit a Support Ticket</h2>
                <form onSubmit={handleTicket} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputCls} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Subject *</label>
                    <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className={inputCls} placeholder="e.g. Order #1234 not received" />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className={inputCls} placeholder="Please describe your issue in detail..." />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-lg transition-colors">
                    {submitting ? "Submitting..." : "Submit Ticket"}
                  </button>
                </form>
              </div>
              {tickets.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-gray-900 dark:text-white font-bold">Your Tickets</h3>
                  {tickets.map((t) => (
                    <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 dark:text-white font-semibold text-sm">{t.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">{t.date}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400">{t.status}</span>
                        </div>
                      </div>
                      {t.reply && <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">💬 {t.reply}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Contact Info</h3>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>📧 support@pharmagrade.com</p>
                  <p>⏰ Response within 24 hours</p>
                  <p>🌍 Available worldwide</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400 font-semibold text-sm mb-1">Urgent Issue?</p>
                <p className="text-red-600 dark:text-red-500 text-xs">For urgent order problems, switch to Live Chat for fastest response.</p>
                <button onClick={() => setActiveTab("chat")} className="mt-2 text-red-600 dark:text-red-400 text-xs font-medium hover:underline">→ Open Live Chat</button>
              </div>
            </div>
          </div>
        )}

        {/* Live Chat */}
        {activeTab === "chat" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-red-600 px-5 py-3 flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold text-sm">Pharma Grade Support — Online</span>
            </div>
            <div className="h-96 overflow-y-auto p-5 space-y-4 bg-gray-50 dark:bg-gray-900">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 text-sm ${
                    msg.from === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendChat} className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                placeholder="Type your message..."
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
