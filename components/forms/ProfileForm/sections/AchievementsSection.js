"use client";
// components/forms/ProfileForm/sections/AchievementsSection.js
//
// ProfileForm.js already has "use client", so this file is technically inside
// the client boundary and the dynamic() call below works without this directive.
// But Next.js 16's stricter module graph analysis can still flag it during the
// build when it resolves the import graph from a Server Component entry point
// (e.g. the edit page). Being explicit removes all ambiguity.

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";

const Tiptap = dynamic(() => import("@/components/Tiptap/Tiptap"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function AchievementsSection({ control }) {
  return (
    <FormField
      control={control}
      name="achievements"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="border border-border">
              <Tiptap desc={field.value} onChange={field.onChange} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
