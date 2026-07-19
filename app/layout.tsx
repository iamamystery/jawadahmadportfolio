import type { Metadata, Viewport } from "next";
import { Syne, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const SITE_URL = "https://phantextech.com"; // ← replace with your domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muhammad Jawad Ahmad — Backend Engineer · Cybersecurity · Phantex Tech",
    template: "%s — Muhammad Jawad Ahmad",
  },
  description:
    "Digital headquarters of Muhammad Jawad Ahmad: backend engineer, cybersecurity specialist, and founder of Phantex Tech. Secure systems, scalable infrastructure, and technology products.",
  keywords: [
    "Muhammad Jawad Ahmad",
    "Backend Engineer",
    "Cybersecurity Specialist",
    "Phantex Tech",
    "System Design",
    "Secure Architecture",
  ],
  openGraph: {
    title: "Muhammad Jawad Ahmad — Digital Headquarters",
    description:
      "Backend Engineer · Cybersecurity Specialist · Founder of Phantex Tech",
    url: SITE_URL,
    siteName: "Phantex HQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Jawad Ahmad — Digital Headquarters",
    description:
      "Backend Engineer · Cybersecurity Specialist · Founder of Phantex Tech",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070B12",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain font-sans">{children}</body>
    </html>
  );
}
