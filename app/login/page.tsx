"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginPageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <Button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="ml-3"
        >
          Go to Dashboard
        </Button>
      </>
    );
  }

  return (
    <section className="h-screen flex items-center justify-center gap-5 w-full flex-col">
      <h2 className="text-3xl font-bold">Not signed in</h2>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        aria-label="Sign in with Google"
      >
        Sign In <LogIn />
      </Button>
      {error && (
        <div className="bg-destructive/30 p-5 rounded-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
