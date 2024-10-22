import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { default_user_pic } from "@/constants";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { resolveUrl } from "@/utils";

export default function BasicInfoSection({ user, control }) {
  return (
    <div>
      <FormLabel className="text-2xl">Basic Info</FormLabel>
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-6 my-6 w-3xl">
        <div className="flex flex-col gap-7">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    {...field}
                    className="sm:h-[6.13rem] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="pic"
          render={({ field }) => (
            <FormItem>
              <div>
                <Image
                  src={resolveUrl(field.value, default_user_pic)}
                  alt="Profile Picture"
                  width={250}
                  height={250}
                  className="rounded-full mx-auto"
                  loading="lazy"
                />
              </div>
              <FormLabel>
                <p className="mt-4">
                  Profile Pic{" "}
                  <Link
                    href="https://postimages.org/"
                    target="_blank"
                    className="text-blue-300 text-xs"
                  >
                    (Upload & Use Direct link)
                  </Link>
                </p>
              </FormLabel>
              <FormControl>
                <div className="flex gap-x-2 items-center">
                  <Input {...field} />
                  <RotateCcw
                    type="button"
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(resolveUrl(user.pic, default_user_pic))
                    }
                    aria-label="reset image src"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-6 my-10">
        <FormField
          control={control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
