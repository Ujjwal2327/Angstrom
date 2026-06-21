// components/forms/ProfileForm/sections/AchievementsSection.js

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
