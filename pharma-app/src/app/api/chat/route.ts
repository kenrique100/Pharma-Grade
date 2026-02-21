import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { messages, ChatMessage } from "./store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@pharmagrade.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (sessionId) {
    return NextResponse.json(messages.filter((m) => m.sessionId === sessionId));
  }
  // Admin: return all sessions grouped
  const sessions = Array.from(new Set(messages.map((m) => m.sessionId))).map((sid) => {
    const sessionMsgs = messages.filter((m) => m.sessionId === sid);
    const last = sessionMsgs[sessionMsgs.length - 1];
    return {
      sessionId: sid,
      userName: sessionMsgs.find((m) => m.from === "user")?.userName ?? "Guest",
      userEmail: sessionMsgs.find((m) => m.from === "user")?.userEmail ?? "",
      lastMessage: last.text,
      lastTime: last.timestamp,
      unread: sessionMsgs.filter((m) => m.from === "user").length,
      messages: sessionMsgs,
    };
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const msg: ChatMessage = {
    id: Date.now().toString(),
    sessionId: body.sessionId,
    userEmail: body.userEmail ?? "",
    userName: body.userName ?? "Guest",
    text: body.text,
    from: "user",
    timestamp: new Date().toISOString(),
  };
  messages.push(msg);

  // Send email notification to admin
  if (resend && msg.userEmail) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `💬 New Live Chat Message from ${msg.userName}`,
      html: `
        <h2>New message from ${msg.userName} (${msg.userEmail})</h2>
        <p><strong>Message:</strong> ${msg.text}</p>
        <p><strong>Session ID:</strong> ${msg.sessionId}</p>
        <p><strong>Time:</strong> ${new Date(msg.timestamp).toLocaleString()}</p>
        <p>Log in to the admin panel to respond: <a href="${process.env.NEXTAUTH_URL ?? ""}/admin/chat">Admin Chat</a></p>
      `,
    }).catch(() => {/* Email sending is optional */});
  }

  return NextResponse.json(msg, { status: 201 });
}
