import { auth } from "@/auth";
import RegisterForm from "@/components/forms/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  return (
    <div className="flex justify-center items-center h-screen -m-10">
      <RegisterForm session={session} />
    </div>
  );
}
