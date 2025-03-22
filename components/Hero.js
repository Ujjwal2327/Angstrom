import { auth } from "@/auth";
import { Spotlight } from "@/components/ui/Spotlight";
import { MagicButton } from "@/components/ui/MagicButton";
import { FaGoogle } from "react-icons/fa";
import { getUserByEmail } from "@/action/user";
import { Braces, Send, SquareDashedBottomCode } from "lucide-react";
import { Suspense } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { EmptySpace } from "@/components/ui/EmptySpace";

export default function Hero() {
  return (
    <div className="h-screen w-full bg-grid-large-white/[0.03] flex items-center justify-center bg-background antialiased relative overflow-hidden">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-96"
          fill="cyan"
        />
        <Spotlight
          className="absolute -left-10 top-0 sm:left-32 sm:-top-20"
          fill="purple"
        />
        <Spotlight
          className="absolute -left-10 top-0 sm:left-80 sm:-top-28 h-[80vh] w-[50vw]"
          fill="blue"
        />
      </div>

      <div className="flex flex-col gap-6 items-center justify-center px-10 w-full">
        <h2 className=" text-4xl sm:text-7xl font-bold text-center text-white font-sans tracking-tight">
          <div className=" bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r pb-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span>Angstrom</span>
          </div>
        </h2>

        <TextGenerateEffect
          words="The Ultimate Toolbox for Coders and Engineers"
          className="text-xl sm:text-2xl font-extrabold text-center text-neutral-300 -mt-4 sm:mt-0 text-wrap-balance"
        />

        <Suspense fallback={<EmptySpace h="12" />}>
          <SuspenseComponent />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspenseComponent() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  return (
    <div className="flex flex-col md:flex-row gap-4 gap-x-8">
      {!session?.user?.email ? (
        <MagicButton
          title="Sign in with Google"
          href="/sign-in"
          icon={<FaGoogle className="text-lg" />}
          position="right"
        />
      ) : user?.username ? (
        <MagicButton
          title="View Your Profile"
          href={`/users/${user?.username}`}
          icon={<Send size={20} />}
          position="right"
        />
      ) : (
        <></>
      )}
      <MagicButton
        title="JSON Slicer"
        href="/json-slicer"
        icon={<Braces size={20} />}
        position="right"
      />
    </div>
  );
}
