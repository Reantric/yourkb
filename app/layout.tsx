import HeaderAuth from "@/components/header-auth";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import CookieConsentBanner from "@/components/cookieBanner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "YourKB",
  description: "The simplest way to create art on the web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>YourKB</Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <main className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </main>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-12 py-16">
                <span className="flex items-center gap-1">
                  Powered by{" "}
                  <a
                    href="https://supabase.com/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                  <p>and</p>
                  <a
                    href="https://nextjs.org/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Next.js
                  </a>
                </span>
                <span className="flex items-center gap-1">
                  <p>Created by</p>
                  <a
                    href="https://ezou626.github.io/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Eric Zou
                  </a>
                </span>
                <span className="flex items-center gap-1">
                  <Link
                    href="/policies/privacy"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </Link>
                </span>
                <span className="flex items-center gap-1">
                  <Link
                    href="/changelog"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Changelog
                  </Link>
                </span>
              </footer>
            </div>
            <CookieConsentBanner></CookieConsentBanner>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
