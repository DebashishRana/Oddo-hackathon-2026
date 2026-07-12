import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssetFlow",
  description: "ERP-style asset and resource management for teams and hackathons.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "AssetFlow",
    description: "ERP-style asset and resource management for teams and hackathons.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-950">
        {children}
      </body>
    </html>
  );
}
