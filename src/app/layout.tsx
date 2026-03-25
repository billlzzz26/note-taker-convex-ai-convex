import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Note Taker - AI-Powered Notebook",
  description: "An AI-powered notebook with real-time sync via Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
