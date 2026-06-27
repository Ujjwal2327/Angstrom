// app/(auth)/sign-out/page.js
import { auth } from "@/auth";
import SignOut from "@/components/auth/SignOut";
import { permanentRedirect } from "next/navigation";
import Link from "next/link";

export function generateMetadata() {
  return {
    title: "Sign Out | Angstrom",
    description: "Sign out from your Angstrom account.",
  };
}

export default async function SignOutPage() {
  const session = await auth();
  if (!session) permanentRedirect("/sign-in");

  const name = session.user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] -m-10 px-5">
      <div className="w-full max-w-sm">
        <div className="border border-border bg-card/80 backdrop-blur p-8 space-y-6 text-center">
          <div className="space-y-1.5">
            <div className="font-black text-3xl gradient-text">Angstrom</div>
            <p className="text-sm text-muted-foreground">
              Hey {name} — see you next time.
            </p>
          </div>

          <div className="border-t border-border" />

          <div className="space-y-3">
            <SignOut isFull />
            <Link
              href="/"
              className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              stay signed in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
