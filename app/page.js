import { auth } from "@/auth";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { SignOut } from "@/components/auth/SignOut";

export default async function Home() {
  const session = await auth();

  return (
    <>
      home
      {!session && <GoogleSignIn />}
      {session && <SignOut />}
    </>
  );
}
