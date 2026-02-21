import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { messages, ChatMessage } from "../store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, text } = body;

  // Find the session's user info
  const sessionMsg = messages.find((m) => m.sessionId === sessionId && m.from === "user");

  const reply: ChatMessage = {
    id: Date.now().toString(),
    sessionId,
    userEmail: sessionMsg?.userEmail ?? "",
    userName: "Support Team",
    text,
    from: "admin",
    timestamp: new Date().toISOString(),
  };
  messages.push(reply);

  // Send email notification to user
  if (resend && sessionMsg?.userEmail) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: sessionMsg.userEmail,
      subject: "💬 Pharma Grade Support replied to your message",
      html: `
        <h2>You have a new reply from Pharma Grade Support</h2>
        <p><strong>Support:</strong> ${text}</p>
        <p><strong>Time:</strong> ${new Date(reply.timestamp).toLocaleString()}</p>
        <p>Visit <a href="${process.env.NEXTAUTH_URL ?? ""}/support">our support page</a> to continue the conversation.</p>
      `,
    }).catch(() => {/* Email sending is optional */});
  }

  return NextResponse.json(reply, { status: 201 });
}
