import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Jai Shri Ram Naam - जय श्री राम नाम",
  description: "राम नाम का लिखित जाप - Jai Shri Ram Naam Lekhan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${sans.variable} ${serif.variable} ${display.variable}`}>
      <body className="antialiased font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
