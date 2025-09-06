import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const DEFAULT_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

  const origin = explicit ? explicit : DEFAULT_URL;
  
  return {
    metadataBase: new URL(origin),
    title: "YourKB",
    description: "The simplest way to make your mark on the web",
  };
}

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
              <Header />

              <main className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </main>

              <Footer />
            </div>
            <CookieConsentBanner />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
