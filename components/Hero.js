import { auth } from "@/auth";
import { Spotlight } from "./ui/Spotlight";
import Link from "next/link";
import { MagicButton } from "./ui/MagicButton";
import { FaGoogle } from "react-icons/fa";
import { Send } from "lucide-react";

export default async function Hero() {
  const session = await auth();

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
        <h2 className="relative text-4xl sm:text-7xl font-bold text-center text-white font-sans tracking-tight">
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r pb-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span className="">Angstrom</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 pb-4">
              <span className="">Angstrom</span>
            </div>
          </div>
        </h2>
        <p className=" text-xl sm:text-2xl  font-bold text-neutral-300 text-center">
          The Ultimate Toolbox for Coders and Engineers
        </p>
        <div className="flex flex-col md:flex-row gap-4 gap-x-8">
          <Link href="/users">
            <MagicButton title="Browse User Profiles" 
            position="right"
            icon={<Send size={20} />}
            />
          </Link>
          {!session?.user?.email && (
            <Link href="/sign-in">
              <MagicButton
                title="Sign in with Google"
                position="right"
                icon={<FaGoogle className="text-xl" />}
                otherClasses="bg-secondary text-primary-foreground"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
