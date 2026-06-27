import JsonSlicer from "@/components/JsonSlicer";

export function generateMetadata() {
  return {
    title: "JSON Slicer | Angstrom",
    description:
      "Effortlessly extract and refine JSON data. Select fields, apply filters, and generate clean, structured JSON output.",
  };
}

export default async function JsonSlicerPage() {
  return <JsonSlicer />;
}
