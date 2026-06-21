import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// BUGFIX/cleanup: GitHub was registered as a provider here but never used —
// the only sign-in call anywhere in the app is `signIn("google")`
// (components/auth/GoogleSignIn.js), and the GitHub OAuth credentials in
// .env are filed under a "NONE" section, suggesting they were already
// considered abandoned. Removed the dead provider and the unused
// `CredentialsSignin` import. If GitHub sign-in is wanted later, re-add the
// provider here and a corresponding sign-in button — there's nothing else
// depending on it right now.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
});
