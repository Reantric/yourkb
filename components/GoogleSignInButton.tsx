"use client";

import { Button } from "./ui/button";
import { signInWithGoogle } from "@/app/actions";

export default function GoogleSignInButton({ text }: { text: string }) {
  return (
    <Button variant="link" onClick={signInWithGoogle}>
      {text}
    </Button>
  );
}
