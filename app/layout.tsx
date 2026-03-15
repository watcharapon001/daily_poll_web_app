import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "./components/theme-toggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Poll - Vote on Today's Question",
  description: "Join the daily poll, see what others think, and vote on interesting topics every day.",
  openGraph: {
    title: "Daily Poll - Vote on Today's Question",
    description: "Join the daily poll, see what others think, and vote on interesting topics every day.",
    type: "website",
    url: "https://dailypoll.app", // Placeholder URL
    siteName: "Daily Poll",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Poll - Vote on Today's Question",
    description: "Join the daily poll, see what others think, and vote on interesting topics every day.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                if (theme === 'light' || (!theme && !supportDarkMode)) {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <header className="w-full border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-semibold text-xl tracking-tight text-white group-hover:text-indigo-50 transition-colors">Daily Poll</span>
            </a>
            <nav className="flex items-center gap-4">
              <a href="/create" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                + Create Poll
              </a>
              <a href="/history" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                History
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          {children}
        </main>
        <footer className="w-full text-center py-6 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Daily Poll. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
