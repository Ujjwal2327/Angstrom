import MarkdownEditor from "@/components/tools/readme-generator/MarkdownEditor/MarkdownEditor";
import { auth } from "@/auth";
import { getUserByEmail } from "@/action/user";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function MarkdownEditorPage() {
  return (
    <div className="-mt-10">
      <Suspense fallback={<Loader className="mt-10" />}>
        <SuspenseComponent />
      </Suspense>
    </div>
  );
}

async function SuspenseComponent() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  return <MarkdownEditor user={user} />;
}
