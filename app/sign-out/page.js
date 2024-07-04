import { auth } from "@/auth";
import SignOut from "@/components/auth/SignOut";
import { permanentRedirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (!session) permanentRedirect("/sign-in");
  return (
    <div className="flex justify-center items-center h-screen">
      <SignOut />
    </div>
  );
}
