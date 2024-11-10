import CodeDiffer from "@/components/code/CodeDiffer";

export function generateMetadata({ params }) {
  return {
    title: `Code Differ | Angstrom`,
    description: `Easily compare and highlight differences between two code blocks. Perfect for code reviews, debugging, and tracking changes across versions. This tool helps streamline the comparison process and improve your coding workflow.`,
  };
}

export default function CodeDifferPage() {
  return <CodeDiffer />;
}
