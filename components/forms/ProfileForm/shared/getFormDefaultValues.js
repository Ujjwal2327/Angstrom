// components/forms/ProfileForm/shared/getFormDefaultValues.js
//
// Single source of truth for "user (DB shape) -> form (react-hook-form shape)".
// Previously this mapping lived inline inside ProfileForm.js's useForm() call.
// Pulling it out means the AI-import feature can build its "current profile"
// JSON from the exact same shape the form itself uses — the two can't drift
// apart the way two separate hand-written mappings eventually would.

import { profiles as knownProfiles, default_user_pic } from "@/constants";
import { resolveUrl } from "@/utils";

export function getFormDefaultValues(user) {
  return {
    username: user.username,
    email: user.email,
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    pic: resolveUrl(user.pic, default_user_pic),
    about: user.about || "",
    achievements: user.achievements || "",
    skills: user.skills || [],
    profiles: Object.keys(knownProfiles).reduce((acc, p) => {
      if (user.profiles?.[p]) acc[p] = user.profiles[p];
      return acc;
    }, {}),
    projects:
      user.projects?.map((p) => ({
        order: p.order,
        name: p.name,
        live_url: p.live_url,
        code_url: p.code_url,
        skills: p.skills || [],
        about: p.about,
      })) || [],
    education:
      user.education?.map((e) => ({
        order: e.order,
        institution: e.institution,
        degree: e.degree,
        score: e.score || "",
        specialization: e.specialization || "",
        start: e.start,
        end: e.end,
      })) || [],
    experience:
      user.experience?.map((e) => ({
        order: e.order,
        company: e.company,
        position: e.position,
        start: e.start,
        end: e.end || "",
        about: e.about,
      })) || [],
  };
}
