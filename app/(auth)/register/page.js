// app/(auth)/register/page.js
import { auth } from "@/auth";
import RegisterForm from "@/components/forms/RegisterForm";

export function generateMetadata() {
  return {
    title: "Choose Username | Angstrom",
    description: "Pick a username to complete your Angstrom registration.",
  };
}

export default async function RegisterPage() {
  const session = await auth();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] -m-10 px-5">
      <div className="w-full max-w-sm space-y-4">
        <div className="border border-border bg-card/80 backdrop-blur p-8 space-y-7">
          {/* Brand */}
          <div className="text-center space-y-1.5">
            <div className="font-black text-4xl gradient-text">Angstrom</div>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              one last step
            </p>
          </div>

          <div className="border-t border-border" />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Choose a username for your public portfolio.
            </p>
            <p className="text-xs text-muted-foreground/60 text-center font-mono">
              angstrom.vercel.app/users/
              <span className="text-primary">yourname</span>
            </p>
          </div>

          <RegisterForm session={session} />
        </div>
      </div>
    </div>
  );
}
