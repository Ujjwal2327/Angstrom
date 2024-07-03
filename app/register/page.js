import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import RegisterForm from "@/components/forms/RegisterForm";
import { permanentRedirect, redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  if (!session) permanentRedirect(`/`);
  else if (session.user.email) {
    const user = await getUserByEmail(session.user.email);
    if (user) permanentRedirect(`/`);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <RegisterForm session={session} />
    </div>
  );
}
