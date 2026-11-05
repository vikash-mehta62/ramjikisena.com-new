import type { Metadata, Viewport } from "next";
import { Mukta, Noto_Serif_Devanagari, Yatra_One } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const sans = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

const display = Yatra_One({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ramjikisena.com";
const DESCRIPTION =
  "राम नाम का लिखित जाप, 108 मनकों की डिजिटल माला, दैनिक पंचांग, चौपाई, वैदिक पंडित बुकिंग, कथा व्यास और मंदिर दर्शन — Jai Shri Ram Naam.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jai Shri Ram Naam - जय श्री राम नाम",
    template: "%s | Jai Shri Ram Naam",
  },
  description: DESCRIPTION,
  keywords: [
    "राम नाम", "राम नाम जाप", "Ram Naam", "Ram Naam Jaap", "राम नाम बैंक", "108 माला",
    "पंडित बुकिंग", "Pandit booking", "कथा वाचक", "दैनिक पंचांग", "चौपाई", "अयोध्या", "Jai Shri Ram",
  ],
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: "Jai Shri Ram Naam",
    title: "Jai Shri Ram Naam - जय श्री राम नाम",
    description: DESCRIPTION,
    images: [{ url: "/images/hero-ayodhya-ramji-hd.webp", width: 1920, height: 1080, alt: "अयोध्या धाम में प्रभु श्री राम" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jai Shri Ram Naam - जय श्री राम नाम",
    description: DESCRIPTION,
    images: ["/images/hero-ayodhya-ramji-hd.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#EA580C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${sans.variable} ${serif.variable} ${display.variable}`}>
      <head>
        {/* Scroll-reveal content starts hidden; show it when JavaScript is off */}
        <noscript>
          <style>{`.reveal, .stagger > * { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="antialiased font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
