import { getUserByEmail } from "@/action/user";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserPage({ params }) {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  return (
    <div>
      {user?.username == params.username && (
        <div>
          To edit your details, go to
          <Link href={`/users/${user.username}/edit`} className="ml-3">
            <Button variant="outline">edit page</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
