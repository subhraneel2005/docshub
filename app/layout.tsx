import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import "./globals.css";

export const metadata: Metadata = {
  title: "docs.hub",
  description: "generate documention from your github readme in 50+ diff languages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistMono.className} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
