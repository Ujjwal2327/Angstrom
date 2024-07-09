import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import RegisterForm from "@/components/forms/RegisterForm";
import { permanentRedirect, redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();

  return (
    <div className="flex justify-center items-center h-screen">
      <RegisterForm session={session} />
    </div>
  );
}
