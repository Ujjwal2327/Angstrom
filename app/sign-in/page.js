import { auth } from "@/auth";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { permanentRedirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (session) permanentRedirect("/");
  return (
    <div className="flex justify-center items-center h-screen">
      <GoogleSignIn />
    </div>
  );
}
