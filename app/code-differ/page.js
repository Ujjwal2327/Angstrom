import CodeDiffer from "@/components/CodeDiffer";

export function generateMetadata() {
  return {
    title: `Code Differ | Angstrom`,
    description: `Easily compare and highlight differences between two code blocks. Perfect for code reviews, debugging, and tracking changes across versions.`,
  };
}

export default function CodeDifferPage() {
  return <CodeDiffer />;
}
