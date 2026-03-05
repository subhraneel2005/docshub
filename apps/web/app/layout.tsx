import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistPixelSquare } from 'geist/font/pixel';
import "./globals.css";



export const metadata: Metadata = {
  title: "Docshub",
  description: "Generate documentation from just your github repo url, all inside your terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistPixelSquare.className}  antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
