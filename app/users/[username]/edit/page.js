import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import { permanentRedirect } from "next/navigation";

export default async function UserEditPage({ params }) {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  if (params.username !== user?.username)
    permanentRedirect(`/users/${params.username}`);
  return (
    <>
      {params.username === user?.username && (
        <div className="flex flex-col justify-center items-center">
          <ProfileForm user={user} />
        </div>
      )}
    </>
  );
}
