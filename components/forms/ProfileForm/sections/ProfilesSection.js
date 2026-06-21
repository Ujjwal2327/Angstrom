// components/forms/ProfileForm/sections/ProfilesSection.js

"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { profiles } from "@/constants";
import Link from "next/link";
import { fieldInputClass } from "../shared/formFieldStyles";

export default function ProfilesSection({ control }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.keys(profiles).map((profileName) => (
        <FormField
          key={profileName}
          control={control}
          name={`profiles.${profileName}`}
          render={({ field }) => (
            <FormItem
              className={`flex items-center gap-3 border border-border p-2.5 transition-opacity ${
                !field.value?.trim() ? "opacity-50" : "opacity-100"
              }`}
            >
              <FormLabel className="flex-shrink-0">
                <Link
                  href={
                    field.value
                      ? `${profiles[profileName].base_url}${field.value}`
                      : profiles[profileName].base_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={`/icons/profiles/${profileName}.svg`}
                    width={26}
                    height={26}
                    alt={`${profileName} logo`}
                    loading="lazy"
                  />
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={`${profiles[profileName].name} username`}
                  className={`${fieldInputClass} border-none px-0 h-auto`}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
