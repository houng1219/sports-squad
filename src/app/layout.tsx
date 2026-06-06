import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoTC = Noto_Sans_TC({
  variable: "--font-noto-tc-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SportsSquad 揪團打球 — 找到對的運動夥伴",
  description: "3 分鐘發起揪團，找到對的運動夥伴。籃球、羽球、路跑、網球、足球⋯⋯ 12 個縣市、847 位運動愛好者都在用。",
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
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoTC.variable} min-h-full flex flex-col antialiased`}
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NavBar />
          <main className="flex-1">{children}</main>
          <footer
            className="mt-12 py-8"
            style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-2 text-sm">關於</h4>
                  <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <li><Link href="/">關於我們</Link></li>
                    <li><Link href="/">部落格</Link></li>
                    <li><Link href="/">媒體報導</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-sm">服務</h4>
                  <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <li><Link href="/squads">瀏覽揪團</Link></li>
                    <li><Link href="/squads/new">發起揪團</Link></li>
                    <li><Link href="/recommend">智能推薦</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-sm">協助</h4>
                  <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <li><Link href="/">常見問題</Link></li>
                    <li><Link href="/">聯絡客服</Link></li>
                    <li><Link href="/">使用條款</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-sm">聯絡</h4>
                  <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <li>service@sportssquad.tw</li>
                    <li>LINE: @sportssquad</li>
                    <li>Instagram: @sportssquad.tw</li>
                  </ul>
                </div>
              </div>
              <div
                className="pt-6 text-center text-sm"
                style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                <p>SportsSquad © 2025 — 用揪團讓世界動起來 🏃‍♀️🏀🏸</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
