import MarkdownEditor from "@/components/tools/readme-generator/MarkdownEditor/MarkdownEditor";
import { auth } from "@/auth";
import { getUserByEmail } from "@/action/user";

export function generateMetadata({ params }) {
  return {
    title: `Markdown Editor | Angstrom`,
    description: `Enhance your GitHub profile effortlessly with Angstrom's Markdown Editor. Enjoy seamless editing, live previews, and one-click generation of customized README profiles.`,
  };
}

export default async function MarkdownEditorPage() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  return <MarkdownEditor user={user} />;
}
