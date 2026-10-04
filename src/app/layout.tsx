import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import PrototypeBanner from "@/components/PrototypeBanner";
import { WORKSHOP_CONFIG } from "@/config";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
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
    images: [
      {
        url: `${WORKSHOP_CONFIG.siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: WORKSHOP_CONFIG.ogImageAlt,
      },
    ],
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
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] font-body text-[#0F172A]">
        {/* Prototype banner is rendered on ALL pages as required by PLAN.md §4 T1-6 */}
        <PrototypeBanner />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
