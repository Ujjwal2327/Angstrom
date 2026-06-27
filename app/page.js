// app/page.js
import Hero from "@/components/hero/Hero";

// The Hero component uses min-h-screen and handles its own full-bleed layout.
// The -m-10 wrapper cancels the p-10 from layout.js so the hero bleeds edge-to-edge.
// The pt-14 in layout.js already accounts for the fixed navbar, so the hero
// starts flush under the navbar.
export default function Home() {
  return (
    <div className="-m-10">
      <Hero />
    </div>
  );
}
