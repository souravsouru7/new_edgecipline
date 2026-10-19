import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// After globals.css on purpose: the motion layer refines those rules.
import "./motion.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edgecipline | Understand Your Trading Behaviour",
  description: "An AI trading journal for understanding patterns, emotions, decisions, and the discipline behind every trade.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  robots: { index: true, follow: true },
  openGraph: { title: "Edgecipline | Understand Your Trading Behaviour", description: "An AI trading journal for understanding patterns, emotions, decisions, and the discipline behind every trade.", type: "website", ...(siteUrl ? { images: [{ url: "/hero/landscape.webp", width: 2560, height: 1441 }] } : {}) },
  twitter: { card: "summary_large_image", title: "Edgecipline | Understand Your Trading Behaviour", description: "An AI trading journal for understanding patterns, emotions, decisions, and the discipline behind every trade.", ...(siteUrl ? { images: ["/hero/landscape.webp"] } : {}) },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
