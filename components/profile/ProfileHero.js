// components/profile/ProfileHero.js
import Image from "next/image";
import Link from "next/link";
import { default_user_pic, profiles } from "@/constants";
import { resolveUrl } from "@/utils";
import { Pencil, Mail } from "lucide-react";

export default function ProfileHero({ user, isOwner, isCreator }) {
  const firstName = user.firstname || user.username;
  const lastName = user.lastname || "";
  const linkedProfiles = user.profiles ? Object.keys(user.profiles).sort() : [];

  return (
    <header className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-10 border-b border-border overflow-hidden">
      {/* Ghost letter watermark */}
      <span
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 font-black leading-none select-none pointer-events-none text-[clamp(6rem,18vw,14rem)] tracking-tighter"
        style={{ color: "hsl(var(--foreground) / 0.025)" }}
      >
        {(firstName[0] || "A").toUpperCase()}
      </span>

      <div className="relative flex items-start justify-between gap-6 sm:gap-10">
        {/* Name block */}
        <div className="min-w-0 flex-1">
          {/* @handle — rendered above the name on mobile for breathing room */}
          <div
            className="font-mono text-[clamp(0.7rem,1.5vw,0.85rem)] tracking-[0.2em] mb-3 uppercase"
            style={{ color: "hsl(var(--primary) / 0.6)" }}
          >
            @{user.username}
          </div>

          <div className="leading-[0.85] break-words">
            <div className="font-black tracking-tight text-foreground text-[clamp(2.5rem,9vw,6.5rem)]">
              {firstName}
            </div>
            {lastName && (
              <div className="font-black tracking-tight text-primary text-[clamp(2.5rem,9vw,6.5rem)]">
                {lastName}
              </div>
            )}
          </div>

          {/* Owner / contact + creator badge */}
          <div className="flex items-center flex-wrap gap-4 mt-6">
            {isOwner ? (
              <Link
                href={`/users/${user.username}/edit`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors border-b border-border hover:border-primary pb-0.5"
              >
                <Pencil size={11} />
                edit portfolio
              </Link>
            ) : (
              <Link
                href={`mailto:${user.email}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors border-b border-border hover:border-primary pb-0.5"
              >
                <Mail size={11} />
                say hello
              </Link>
            )}
            {isCreator && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary bg-primary/10 border border-primary/25 px-2 py-1 rounded-sm">
                creator of angstrom
              </span>
            )}
          </div>
        </div>

        {/* Profile picture */}
        {user.pic && (
          <div
            className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 overflow-hidden mt-1 ring-1 ring-border/60"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
              filter: "grayscale(0.2) contrast(1.05)",
            }}
          >
            <Image
              src={resolveUrl(user.pic, default_user_pic)}
              alt={`${firstName}'s profile picture`}
              width={144}
              height={144}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Social profiles row */}
      {linkedProfiles.length > 0 && (
        <div className="flex flex-wrap mt-8 pt-5 border-t border-border gap-y-0">
          {linkedProfiles.map((profileName, i) => (
            <Link
              key={profileName}
              href={`${profiles[profileName].base_url}${user.profiles[profileName]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors py-3 pr-5 mr-5 border-r border-border last:border-r-0 last:mr-0 last:pr-0"
            >
              {profiles[profileName].name.toLowerCase()}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
