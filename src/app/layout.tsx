import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AssetFlow — Enterprise Asset & Resource Management",
  description: "Track assets, allocations, bookings, maintenance, and audits in one ERP workspace.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "AssetFlow",
    description: "Enterprise asset and resource management for modern organizations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="bg-[var(--af-bg)] text-[var(--af-ink)] antialiased">{children}</body>
    </html>
  );
}
