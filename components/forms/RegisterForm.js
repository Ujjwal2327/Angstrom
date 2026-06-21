"use client";
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
    .min(2, { message: "Username must be at least 2 characters." })
    .max(15, { message: "Username must be at most 15 characters." })
    .refine((username) => !/\s/.test(username), {
      message: "Username must not contain spaces.",
    })
    .transform((username) => username.toLowerCase()),
});

export default function RegisterForm({ session }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(formdata) {
    const { name, email, image: pic } = session.user;
    // BUGFIX: `name.split(" ")` assumed every Google account name has at
    // least a first and last word. A single-word name (or, in rare cases,
    // a missing name if the profile scope didn't return one) made
    // `lastname` come back `undefined`, which is harmless since it's
    // optional in the schema, but a `name` of `undefined` would have
    // thrown outright on `.split()`. Guarding here so registration never
    // crashes on an unusual Google profile.
    const [firstname, ...rest] = (name || "").trim().split(" ");
    const lastname = rest.join(" ") || undefined;
    formdata = { ...formdata, email, firstname, lastname, pic };

    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();

      if (data.user) {
        toast.success("User created successfully");
        router.push(`/users/${data.user.username}`);
        router.refresh();
      } else if (data.error) throw new Error(data.error);
    } catch (error) {
      console.log("Error submitting form:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`w-2/3 p-5 rounded-md space-y-6 bg-primary-foreground flex flex-col max-w-96 ${
          loading && "loading opacity-50"
        }`}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className={`w-full font-bold ${loading && "loading"}`}
          aria-label="register username"
        >
          {loading ? (
            <>
              Loading <Spinner className="size-4 ml-2" />
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
}
