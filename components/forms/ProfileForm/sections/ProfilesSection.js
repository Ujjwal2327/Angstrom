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

export default function ProfilesSection({ control }) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Profiles</FormLabel>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-5">
        {Object.keys(profiles).map((profileName) => (
          <div key={profileName} className="flex items-center">
            <FormField
              control={control}
              name={`profiles.${profileName}`}
              render={({ field }) => (
                <FormItem
                  className={`flex justify-center items-center ${
                    !field.value?.trim() && "opacity-50"
                  }`}
                >
                  <div className="flex items-center">
                    <FormLabel>
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
                          width={30}
                          height={30}
                          alt={`${profileName} logo`}
                          loading="lazy"
                        />
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`${profiles[profileName].name} Username`}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
