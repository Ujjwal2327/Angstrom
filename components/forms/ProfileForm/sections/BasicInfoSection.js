// components/forms/ProfileForm/sections/BasicInfoSection.js

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
import {
  fieldInputClass,
  fieldTextareaClass,
  fieldLabelClass,
} from "../shared/formFieldStyles";

export default function BasicInfoSection({ user, control }) {
  return (
    <div>
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-10">
        <div className="flex flex-col gap-6 min-w-0">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={fieldLabelClass}>email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    disabled
                    className={`${fieldInputClass} mt-1.5`}
                  />
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
                <FormLabel className={fieldLabelClass}>username *</FormLabel>
                <FormControl>
                  <Input {...field} className={`${fieldInputClass} mt-1.5`} />
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
                <FormLabel className={fieldLabelClass}>about</FormLabel>
                <FormControl>
                  <Textarea
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    {...field}
                    className={`${fieldTextareaClass} mt-1.5 sm:h-[6.13rem]`}
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
            <FormItem className="flex-shrink-0">
              <div
                className="w-32 h-32 sm:w-36 sm:h-36 mx-auto sm:mx-0 overflow-hidden opacity-95"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
                }}
              >
                <Image
                  src={resolveUrl(field.value, default_user_pic)}
                  alt="Profile Picture"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <FormLabel
                className={`${fieldLabelClass} mt-3 block text-center sm:text-left`}
              >
                profile pic{" "}
                <Link
                  href="https://postimages.org/"
                  target="_blank"
                  className="text-accent-link normal-case tracking-normal"
                >
                  (upload &amp; use direct link)
                </Link>
              </FormLabel>
              <FormControl>
                <div className="flex gap-x-2 items-center mt-1.5">
                  <Input {...field} className={fieldInputClass} />
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(resolveUrl(user.pic, default_user_pic))
                    }
                    className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="reset image src"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        <FormField
          control={control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldLabelClass}>first name</FormLabel>
              <FormControl>
                <Input {...field} className={`${fieldInputClass} mt-1.5`} />
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
              <FormLabel className={fieldLabelClass}>last name</FormLabel>
              <FormControl>
                <Input {...field} className={`${fieldInputClass} mt-1.5`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
