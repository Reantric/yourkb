"use client";

import { Button } from "./ui/button";
import { signInWithGoogle } from "@/app/actions";

export default function GoogleSignInButton() {
  return (
    <Button variant="link" onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
}
