import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";

export default async function Index() {
  return (
    <>
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
      </div>
      <h1 className="text-5xl lg:text-6xl !leading-tight mx-auto max-w-xl text-center">YourKB</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The simplest way to display your creativity on the web.
      </p>
    </div>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {<SignUpUserSteps />}
      </main>
    </>
  );
}
