import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import "./globals.css";
import NextAuthProvider from "@/lib/providers/next-auth-provider";
import { Toaster } from "sonner";

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
        <Toaster richColors position="top-center" style={{ fontFamily: "inherit" }} />
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
