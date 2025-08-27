import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "YourKB",
  description: "The simplest way to make your mark on the web",
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
