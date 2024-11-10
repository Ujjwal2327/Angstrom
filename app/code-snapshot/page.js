import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";
const CodeSnapshot = dynamic(
  () => import("@/components/code/codeSnapshot/CodeSnapshot"),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

export default function codeSnapshotPage() {
  return <CodeSnapshot />;
}
