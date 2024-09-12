import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

export default async function UserEditPage({ params }) {
  params.username = decodeURIComponent(params.username);

  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  if (params.username !== user?.username)
    permanentRedirect(`/users/${params.username}`);

  return (
    <>
      {params.username === user?.username && (
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-md p-3 w-full flex flex-wrap gap-3 justify-center items-center mb-10">
            Watch your profile
            <Link href={`/users/${user.username}`}>
              <Button variant="outline">here</Button>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center">
            <ProfileForm user={user} />
          </div>
        </div>
      )}
    </>
  );
}
