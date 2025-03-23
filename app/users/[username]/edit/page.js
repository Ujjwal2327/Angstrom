import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm/ProfileForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

export function generateMetadata({ params }) {
  return {
    title: `Edit Profile | Angstrom`,
    description: `Update your Angstrom profile with new information. Modify your personal details, career achievements, and more.`,
  };
}

export default async function UserEditPage({ params }) {
  params.username = decodeURIComponent(params.username);
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  if (params.username !== user?.username)
    permanentRedirect(`/users/${params.username}`);

  return (
    <div className="flex flex-col justify-center items-center max-w-3xl mx-auto">
      {params.username === user?.username && (
        <>
          <div className="bg-slate-900 rounded-md p-3 mb-6 w-full flex flex-wrap gap-3 justify-center items-center">
            View Portfolio
            <Link href={`/users/${user.username}`}>
              <Button variant="outline" aria-label="view portfolio">
                Here
              </Button>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center">
            <ProfileForm user={user} />
          </div>
        </>
      )}
    </div>
  );
}
