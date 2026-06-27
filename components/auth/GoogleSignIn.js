// components/auth/GoogleSignIn.js
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export default function GoogleSignIn({ isFull }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button
        variant="outline"
        type="submit"
        className={`h-11 gap-2.5 font-medium ${isFull ? "w-full" : ""}`}
        aria-label="Sign in with Google"
      >
        <FaGoogle className="text-sm flex-shrink-0" />
        Continue with Google
      </Button>
    </form>
  );
}
