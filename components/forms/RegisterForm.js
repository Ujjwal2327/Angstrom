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

// Define the Zod schema
const FormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .refine((username) => !/\s/.test(username), {
      message: "Username must not contain spaces.",
    })
    .transform((username) => username.toLowerCase()),
});

export default function InputForm({ session }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(formdata) {
    const { name, email, image: pic } = session.user;
    const [firstname, lastname] = name.split(" ");
    formdata = { ...formdata, email, firstname, lastname, pic };

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();

      if (data.user) {
        router.push("/");
        toast.success("User created successfully");
      } else throw new Error(data.error || "Failed to create user");
    } catch (error) {
      console.log("Error submitting form:", error.message);
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 p-5 rounded-md space-y-6 bg-primary-foreground flex flex-col max-w-96"
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
              <FormMessage className="dark:text-red-400" />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
