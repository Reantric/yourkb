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
          King Zou
        </a>
      </span>
      <Link
        href="/policies/privacy"
        className="font-bold hover:underline"
        rel="noreferrer"
      >
        Privacy Policy
      </Link>
      <a
        href="https://github.com/ezou626/yourkb"
        target="_blank"
        className="font-bold hover:underline"
        rel="noreferrer"
      >
        Source Code
      </a>
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
