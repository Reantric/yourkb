import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { MenuIcon } from "lucide-react"; // For hamburger icon

export default async function Header() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  const NavLinks = () => (
    <>
      <Button asChild size="sm" variant="outline">
        <Link href="/gallery">Gallery</Link>
      </Button>
      {user && (
        <Button asChild size="sm" variant="outline">
          <Link href="/protected">Draw</Link>
        </Button>
      )}
      {!user ? (
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </>
      ) : (
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          formAction={signOutAction}
        >
          Log Out
        </Button>
      )}

      <ThemeSwitcher />
    </>
  );

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <Link href="/" className="font-semibold">
          YourKB
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {user && (
            <span className="text-muted-foreground text-sm">
              Hey, {user.email}!
            </span>
          )}
          <NavLinks />
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-6">
                {user && (
                  <p className="text-muted-foreground text-sm">
                    Hey, {user.email}!
                  </p>
                )}
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
