import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Just-In-Time Follow-Up Portal",
  description: "Touch-first showroom follow-up CRM for retail teams"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}