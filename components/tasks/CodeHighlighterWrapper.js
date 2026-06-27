"use client";
// components/tasks/CodeHighlighterWrapper.js
//
// Next.js 16: dynamic({ ssr: false }) is only allowed in Client Components.
// The tasks page is a Server Component (it reads tasksData synchronously and
// uses async params), so we can't put the dynamic import there. This thin
// "use client" wrapper hosts the dynamic import and re-exports the component,
// letting the Server Component import it like any other Client Component.

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";

const CodeHighlighter = dynamic(() => import("@/components/CodeHighlighter"), {
  ssr: false,
  loading: () => <Loader />,
});

export default CodeHighlighter;
