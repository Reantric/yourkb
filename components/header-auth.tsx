import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";

export default async function AuthButton() {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  return user ? (
    <div className="flex items-center gap-2">
      Hey, {user.email}!
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/protected">Edit your KB</Link>
      </Button>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/gallery">Gallery</Link>
      </Button>
      <form action={signOutAction}>
        <Button type="submit" size="sm" variant={"outline"}>
          Sign out
        </Button>
      </form>
      <ThemeSwitcher />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/gallery">Gallery</Link>
      </Button>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
      <ThemeSwitcher />
    </div>
  );
}
