// components/profile/ProfileHero.js

import Image from "next/image";
import Link from "next/link";
import { default_user_pic, profiles } from "@/constants";
import { resolveUrl } from "@/utils";

export default function ProfileHero({ user, isOwner, isCreator }) {
  const firstName = user.firstname || user.username;
  const lastName = user.lastname || "";
  const linkedProfiles = user.profiles ? Object.keys(user.profiles).sort() : [];

  return (
    <header className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8 border-b border-border overflow-hidden">
      <div className="flex items-start justify-between gap-6 sm:gap-10">
        <div className="leading-[0.82] min-w-0 flex-1">
          <div className="font-black tracking-tight text-foreground text-[clamp(2.25rem,9vw,6.5rem)] break-words">
            {firstName}
          </div>
          {lastName && (
            <div className="font-black tracking-tight text-primary text-[clamp(2.25rem,9vw,6.5rem)] break-words">
              {lastName}
            </div>
          )}
          <div
            className="font-mono font-medium mt-2.5 text-[clamp(0.9rem,2.2vw,1.4rem)] tracking-wide"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px hsl(var(--border))",
            }}
          >
            @{user.username}
          </div>
        </div>

        {user.pic && (
          <div
            className="hidden sm:block flex-shrink-0 w-28 h-28 lg:w-36 lg:h-36 overflow-hidden opacity-90 mt-1"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
              filter: "grayscale(0.4) contrast(1.05)",
            }}
          >
            <Image
              src={resolveUrl(user.pic, default_user_pic)}
              alt={firstName}
              width={144}
              height={144}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* owner/contact action + creator tag — sits below the name block, not
          fighting for the same corner as the avatar or the fixed dot-nav */}
      <div className="flex items-center gap-4 mt-6">
        {isOwner ? (
          <Link
            href={`/users/${user.username}/edit`}
            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors border-b border-border hover:border-primary pb-1"
          >
            edit portfolio ↗
          </Link>
        ) : (
          <Link
            href={`mailto:${user.email}`}
            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors border-b border-border hover:border-primary pb-1"
          >
            say hello ↗
          </Link>
        )}
        {isCreator && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-primary bg-primary/10 border border-primary/30 rounded-sm px-2 py-1">
            creator of angstrom
          </span>
        )}
      </div>

      {linkedProfiles.length > 0 && (
        <div className="flex flex-wrap mt-8 border-t border-border">
          {linkedProfiles.map((profileName) => (
            <Link
              key={profileName}
              href={`${profiles[profileName].base_url}${user.profiles[profileName]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors py-3.5 pr-5 mr-5 border-r border-border last:border-r-0 last:mr-0 last:pr-0"
            >
              {profiles[profileName].name.toLowerCase()}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
