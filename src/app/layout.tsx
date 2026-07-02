import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { Toaster } from "sonner"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dectra- The platform for all your document management needs",
  description: "Manage, verify, and redirect documents all at once with Dectra. Instant EDV validation, QR-based access, and secure redirects.",
  keywords: ["Document Verification", "EDV", "QR Access", "Compliance", "Identity Verification", "SAAS"],
  authors: [{ name: "Dectra Team" }],
  creator: "Dectra",
  publisher: "Dectra",
  icons: {
    icon: "/Logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dectra.com",
    title: "Dectra - Instant Document Verification",
    description: "Manage, verify, and redirect documents all at once with Dectra. Instant EDV validation, QR-based access, and secure redirects.",
    siteName: "Dectra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dectra - Instant Document Verification",
    description: "Manage, verify, and redirect documents all at once with Dectra. Instant EDV validation, QR-based access, and secure redirects.",
    creator: "@dectra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          defaultTheme="dark"
          storageKey="ui-theme"
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
