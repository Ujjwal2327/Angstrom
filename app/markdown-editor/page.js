import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import { auth } from "@/auth";
import { getUserByEmail } from "@/action/user";

export function generateMetadata() {
  return {
    title: `Markdown Editor | Angstrom`,
    description: `Enhance your GitHub profile with Angstrom's Markdown Editor. Live preview and one-click README generation.`,
  };
}

export default async function MarkdownEditorPage() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  return <MarkdownEditor user={user} />;
}
