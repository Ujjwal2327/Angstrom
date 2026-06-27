// app/users/[username]/edit/page.js

import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm/ProfileForm";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `Edit Portfolio | Angstrom`,
    description: `Update ${decodeURIComponent(username)}'s Angstrom portfolio.`,
  };
}

export default async function UserEditPage({ params }) {
  // Next.js 16: sync params access is fully removed — always await.
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername);

  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);

  if (username !== user?.username) permanentRedirect(`/users/${username}`);

  return (
    <div className="-m-10">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
              editing
            </div>
            <div className="font-mono text-sm text-primary truncate">
              @{user.username}
            </div>
          </div>
          <Link
            href={`/users/${user.username}`}
            className="flex-shrink-0 font-mono text-xs text-muted-foreground hover:text-primary transition-colors border-b border-border hover:border-primary pb-1"
          >
            view live portfolio ↗
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
