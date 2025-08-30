import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MenuIcon } from "lucide-react"; // For hamburger icon

function SheetCloseButton({
  button,
  inSheet,
}: {
  button: React.ReactNode;
  inSheet: boolean;
}) {
  if (!inSheet) {
    return button;
  }
  return <SheetClose asChild>{button}</SheetClose>;
}

export default async function Header() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  // optional funciton is for closing the sidebar on click
  const NavLinks = ({ inSheet }: { inSheet: boolean }) => (
    <>
      <SheetCloseButton
        button={
          <Button asChild size="sm" variant="outline">
            <Link href="/gallery">Gallery</Link>
          </Button>
        }
        inSheet={inSheet}
      />
      {user ? (
        <>
          <SheetCloseButton
            button={
              <Button asChild size="sm" variant="outline">
                <Link href="/draw">Draw</Link>
              </Button>
            }
            inSheet={inSheet}
          />
          <SheetCloseButton
            button={
              <Button size="sm" variant="secondary" onClick={signOutAction}>
                Log Out
              </Button>
            }
            inSheet={inSheet}
          />
        </>
      ) : (
        <>
          <SheetCloseButton
            button={
              <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">Log In</Link>
              </Button>
            }
            inSheet={inSheet}
          />
          <SheetCloseButton
            button={
              <Button asChild size="sm" variant="default">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            }
            inSheet={inSheet}
          />
        </>
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
          <NavLinks inSheet={false} />
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
              <SheetTitle>Actions</SheetTitle>
              <div className="flex flex-col gap-4 mt-6">
                {user && (
                  <p className="text-muted-foreground text-sm">
                    Hey, {user.email}!
                  </p>
                )}
                <NavLinks inSheet={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
