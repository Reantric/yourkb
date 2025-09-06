const DEFAULT_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(DEFAULT_URL),
  title: "YourKB",
  description: "The simplest way to make your mark on the web",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    {children}
  );
}
