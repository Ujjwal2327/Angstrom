import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import { permanentRedirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user?.email) {
    const user = await getUserByEmail(session.user.email);
    // console.log("USER in Home: ", user);
    if (!user) permanentRedirect(`/register`);
  }
  return <></>;
}
