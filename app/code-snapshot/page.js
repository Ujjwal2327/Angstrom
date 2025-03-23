import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";
const CodeSnapshot = dynamic(
  () => import("@/components/codeSnapshot/CodeSnapshot"),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

export function generateMetadata({ params }) {
  return {
    title: `Code Snapshot | Angstrom`,
    description: `Create beautiful code snapshots with stunning themes. Highlight your code, export in multiple formats, and share a unique link. Ideal for showcasing, collaborating, and sharing your work online in a polished and professional way.`,
  };
}

export default function codeSnapshotPage() {
  return <CodeSnapshot />;
}
