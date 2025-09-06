const DEFAULT_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(DEFAULT_URL),
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <>
      {children}
    </>
  );
}
