import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import type { ChatMessage } from "./store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@pharmagrade.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

/** Helper: convert a Prisma ChatMessage row to the ChatMessage interface shape */
function toMsg(row: {
  id: string;
  sessionId: string;
  userEmail: string;
  userName: string;
  text: string;
  from: string;
  timestamp: Date;
}): ChatMessage {
  return { ...row, from: row.from as "user" | "admin", timestamp: row.timestamp.toISOString() };
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (sessionId) {
    // User view: return all messages for this session
    const rows = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: "asc" },
    });
    return NextResponse.json(rows.map(toMsg));
  }

  // Admin view: return all sessions grouped by sessionId
  const allRows = await prisma.chatMessage.findMany({
    orderBy: { timestamp: "asc" },
  });

  const sessionMap = new Map<string, (typeof allRows)[number][]>();
  for (const row of allRows) {
    if (!sessionMap.has(row.sessionId)) sessionMap.set(row.sessionId, []);
    sessionMap.get(row.sessionId)!.push(row);
  }

  const sessions = Array.from(sessionMap.entries()).map(([sid, msgs]) => {
    const last = msgs[msgs.length - 1];
    const firstUserMsg = msgs.find((m) => m.from === "user");
    return {
      sessionId: sid,
      userName: firstUserMsg?.userName ?? "Guest",
      userEmail: firstUserMsg?.userEmail ?? "",
      lastMessage: last.text,
      lastTime: last.timestamp.toISOString(),
      unread: msgs.filter((m) => m.from === "user").length,
      messages: msgs.map(toMsg),
    };
  });

  return NextResponse.json(sessions);
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }
  await prisma.chatMessage.deleteMany({ where: { sessionId } });
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const row = await prisma.chatMessage.create({
    data: {
      sessionId: body.sessionId,
      userEmail: body.userEmail ?? "",
      userName: body.userName ?? "Guest",
      text: body.text,
      from: "user",
    },
  });

  const msg = toMsg(row);

  // Send email notification to admin (best-effort)
  if (resend && msg.userEmail) {
    await resend.emails
      .send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `💬 New Live Chat Message from ${msg.userName}`,
        html: `
          <h2>New message from ${msg.userName} (${msg.userEmail})</h2>
          <p><strong>Message:</strong> ${msg.text}</p>
          <p><strong>Session ID:</strong> ${msg.sessionId}</p>
          <p><strong>Time:</strong> ${new Date(msg.timestamp).toLocaleString()}</p>
          <p>Log in to the admin panel to respond:
            <a href="${process.env.NEXTAUTH_URL ?? ""}/admin/chat">Admin Chat</a>
          </p>
        `,
      })
      .catch(() => {/* email is optional */});
  }

  return NextResponse.json(msg, { status: 201 });
}
