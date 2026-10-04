import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SiteTracker from "@/components/SiteTracker";
import MobileCta from "@/components/MobileCta";
import { WORKSHOP_CONFIG } from "@/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(WORKSHOP_CONFIG.siteUrl),
  title: {
    default: WORKSHOP_CONFIG.title,
    template: `%s | ${WORKSHOP_CONFIG.shortTitle}`,
  },
  description: WORKSHOP_CONFIG.ogDescription,
  openGraph: {
    type: "website",
    siteName: WORKSHOP_CONFIG.shortTitle,
    title: WORKSHOP_CONFIG.title,
    description: WORKSHOP_CONFIG.ogDescription,
    url: WORKSHOP_CONFIG.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: WORKSHOP_CONFIG.title,
    description: WORKSHOP_CONFIG.ogDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Satoshi (NIAT's heading font) from Fontshare's free CDN */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap" />
        {/* Indic-script faces for the ambassador kit (next/font can't load these under Turbopack) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="soft-backdrop" aria-hidden="true" />
        <SiteTracker />
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        {/* The prototype notice now lives in the footer (PLAN.md §4 T1-6: label it, don't pretend it's an official event) */}
        <SiteFooter />
        <MobileCta />
      </body>
    </html>
  );
}
