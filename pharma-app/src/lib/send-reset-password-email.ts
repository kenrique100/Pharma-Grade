import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendResetPasswordEmail({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url: string;
}) {
  if (!resend) {
    console.log(`[EMAIL] Password reset for ${to}: ${url}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
      <h2>Reset your Pharma Grade password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
        Reset Password
      </a>
      <p>Or copy this link: ${url}</p>
      <p>This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
    `,
  });
}
