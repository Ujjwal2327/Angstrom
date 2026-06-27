// components/auth/SignOut.js
import { LogOut } from "lucide-react";
import { signOut } from "@/auth.js";
import { Button } from "@/components/ui/button.jsx";

export default function SignOut({ isFull }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        variant="destructive"
        type="submit"
        className={`h-11 gap-2.5 font-medium ${isFull ? "w-full" : ""}`}
        aria-label="Sign out of Angstrom"
      >
        <LogOut size={15} className="flex-shrink-0" />
        Sign Out
      </Button>
    </form>
  );
}
