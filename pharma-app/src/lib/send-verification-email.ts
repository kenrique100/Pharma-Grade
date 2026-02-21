import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendVerificationEmail({
  to,
  verificationUrl,
  userName,
}: {
  to: string;
  verificationUrl: string;
  userName: string;
}) {
  if (!resend) {
    console.log(`[EMAIL] Verification for ${to}: ${verificationUrl}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your Pharma Grade email",
    html: `
      <h2>Hi ${userName},</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
        Verify Email
      </a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
