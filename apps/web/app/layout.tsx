import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistPixelSquare } from 'geist/font/pixel';
import "./globals.css";

export const metadata: Metadata = {
  title: "Docshub | AI Documentation CLI",
  description: "Generate documentation from just your github repo url, all inside your terminal.",
  metadataBase: new URL('https://docshub.vercel.app'),

  openGraph: {
    title: "Docshub",
    description: "Generate documentation from your GitHub repo URL, all inside your terminal.",
    url: "https://docshub.vercel.app",
    siteName: "Docshub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Docshub - AI Documentation Pipeline",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Docshub | AI Documentation CLI",
    description: "The AI documentation pipeline that lives in your terminal.",
    creator: "@subhraneeltwt",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistPixelSquare.className} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}