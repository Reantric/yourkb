import Link from "next/link";

export default async function Index() {
  return <div className="flex flex-col gap-8 items-center">
    <div className="flex justify-center items-center">
    </div>
    <h1 className="text-5xl lg:text-6xl !leading-tight mx-auto max-w-xl text-center">YourKB</h1>
    <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
      The simplest way to display your creativity on the web.
    </p>
    <div className="flex flex-col gap-4 items-center">
      <ul className="flex text-md text-center justify-between items-center space-x-20">
        <li><Link
                href="/sign-up"
                className="hover:underline"
              >
                Create an account
              </Link></li>
        <li>Draw something amazing</li>
        <li><Link
                href="/view/1"
                className="hover:underline"
              >
                Share the link
              </Link></li>
      </ul>
    </div>
  </div>;
}
