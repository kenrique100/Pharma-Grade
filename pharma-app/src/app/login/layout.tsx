import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Your Account",
  description: "Sign in to your Pharma Grade account to track orders and access member pricing.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
