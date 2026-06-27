"use client";
// components/forms/RegisterForm.js
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "@/components/ui/Spinner";

const FormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, { message: "Must be at least 2 characters." })
    .max(15, { message: "Must be at most 15 characters." })
    .refine((u) => !/\s/.test(u), { message: "No spaces allowed." })
    .transform((u) => u.toLowerCase()),
});

export default function RegisterForm({ session }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { username: "" },
  });

  async function onSubmit(formdata) {
    const { name, email, image: pic } = session?.user ?? {};
    const [firstname, ...rest] = (name || "").trim().split(" ");
    const lastname = rest.join(" ") || undefined;
    const payload = { ...formdata, email, firstname, lastname, pic };

    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.user) {
        toast.success("Welcome to Angstrom!");
        router.push(`/users/${data.user.username}`);
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-4 ${loading ? "loading opacity-50" : ""}`}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="yourname"
                  autoComplete="username"
                  autoFocus
                  className="rounded-none border-border bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11 font-mono"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-mono uppercase tracking-wide text-sm rounded-none"
          aria-label="Register username"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              Creating account <Spinner className="size-4" />
            </span>
          ) : (
            "Claim username →"
          )}
        </Button>
      </form>
    </Form>
  );
}
