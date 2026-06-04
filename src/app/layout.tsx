import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SportsSquad 揪團打球",
  description: "找運動夥伴，發起揪團，快速配對適合的運動社群",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏀</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-100 py-6 mt-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
            <p>SportsSquad © 2025 — 用愛發電，用技術實踐</p>
          </div>
        </footer>
      </body>
    </html>
  );
}