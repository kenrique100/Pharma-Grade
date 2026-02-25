import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Register for a Pharma Grade account to access exclusive member pricing and order tracking.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
