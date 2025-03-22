import JsonSlicer from "@/components/code/JsonSlicer";

export function generateMetadata({ params }) {
  return {
    title: "JSON Slicer | Angstrom",
    description:
      "Effortlessly extract and refine JSON data with Angstrom's JSON Slicer. Select fields, apply filters, and generate clean, structured JSON output.",
  };
}

export default async function MarkdownEditorPage() {
  return <JsonSlicer />;
}
