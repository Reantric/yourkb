import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-2 py-4 md:py-16 md:gap-12 md:flex-row">
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
      <Link
        href="/policies/privacy"
        className="font-bold hover:underline"
        rel="noreferrer"
      >
        Privacy Policy
      </Link>
      <Link
        href="/changelog"
        className="font-bold hover:underline"
        rel="noreferrer"
      >
        Changelog
      </Link>
    </footer>
  );
}
