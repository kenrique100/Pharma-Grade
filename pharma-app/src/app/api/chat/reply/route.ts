import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import type { ChatMessage } from "../store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, text } = body;

  // Find the user's email from the first user message in this session
  const userMsg = await prisma.chatMessage.findFirst({
    where: { sessionId, from: "user" },
    orderBy: { timestamp: "asc" },
  });

  const row = await prisma.chatMessage.create({
    data: {
      sessionId,
      userEmail: userMsg?.userEmail ?? "",
      userName: "Support Team",
      text,
      from: "admin",
    },
  });

  const reply: ChatMessage = {
    ...row,
    from: "admin",
    timestamp: row.timestamp.toISOString(),
  };

  // Send email notification to user (best-effort)
  if (resend && userMsg?.userEmail) {
    await resend.emails
      .send({
        from: FROM_EMAIL,
        to: userMsg.userEmail,
        subject: "💬 Pharma Grade Support replied to your message",
        html: `
          <h2>You have a new reply from Pharma Grade Support</h2>
          <p><strong>Support:</strong> ${text}</p>
          <p><strong>Time:</strong> ${new Date(reply.timestamp).toLocaleString()}</p>
          <p>Visit <a href="${process.env.NEXTAUTH_URL ?? ""}/support">our support page</a>
             to continue the conversation.</p>
        `,
      })
      .catch(() => {/* email is optional */});
  }

  return NextResponse.json(reply, { status: 201 });
}
