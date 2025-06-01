import Header from "@/components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dreamcatcher - Emotional Journey Through Dreams",
  description: "Experience dreams through their emotional landscapes with beautiful animations and insights.",
  icons: {
    icon: "/dreamcatcher.png",
    shortcut: "/dreamcatcher.png",
    apple: "/dreamcatcher.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main style={{ padding: '0 24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
