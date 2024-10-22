import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
const Tiptap = dynamic(() => import("@/components/Tiptap/Tiptap"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function AchievementsSection({ control }) {
  return (
    <div className="my-10">
      <FormField
        control={control}
        name="achievements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-2xl">Achievements</FormLabel>
            <FormControl>
              <Tiptap desc={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
