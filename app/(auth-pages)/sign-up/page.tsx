import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/FormMessage";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto">
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="off"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={message} />
        </div>
      </form>
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm text-muted-foreground">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <GoogleSignInButton text="Sign up with Google" />
    </div>
  );
}
