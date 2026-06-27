"use client";
// app/code-snapshot/page.js
//
// Next.js 16: dynamic({ ssr: false }) is not allowed in Server Components.
// This page has no server-side data dependencies, so "use client" is safe
// and lets us keep the dynamic import for CodeSnapshot (which needs the DOM
// for canvas/html-to-image exports and the Resizable component).
//
// Note: generateMetadata cannot be exported from Client Components. It is
// defined in a separate layout.js or via Next.js metadata file convention.
// For simple static metadata like this, move it to a route segment config
// or a parent layout if needed. For now, the page title is set globally.

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";

const CodeSnapshot = dynamic(
  () => import("@/components/codeSnapshot/CodeSnapshot"),
  { ssr: false, loading: () => <Loader /> },
);

export default function CodeSnapshotPage() {
  return <CodeSnapshot />;
}
