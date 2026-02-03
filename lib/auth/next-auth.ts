import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import type { Account, AuthOptions, Profile } from "next-auth";

import { prisma } from "@/lib/db/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  events: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: { id?: string | null };
      account?: Account | null;
      profile?: Profile;
    }) {
      // Ensure our app-specific GitHub account table is populated on first sign-in
      if (account?.provider !== "github") return;
      if (!user?.id) return;

      // GitHub profile "id" is numeric; normalize to string for our schema
      const githubProfileId =
        profile && typeof profile === "object" && "id" in profile
          ? (profile as { id: string | number }).id
          : undefined;
      const githubUserId =
        typeof githubProfileId === "undefined"
          ? undefined
          : String(githubProfileId);

      const accessToken = account.access_token;
      const scope = account.scope;
      const refreshToken = account.refresh_token;
      const refreshTokenExpiresIn = account.refresh_token_expires_in;

      if (!githubUserId || !accessToken) return;

      await prisma.githubAccount.upsert({
        where: {
          // composite unique: (userId, githubUserId)
          userId_githubUserId: { userId: user.id, githubUserId },
        },
        create: {
          userId: user.id,
          githubUserId,
          accessToken,
          scope: scope ?? "",
          refresh_token: refreshToken,
          refresh_token_expires_in: null,
        },
        update: {
          accessToken,
          scope: scope ?? "",
          refresh_token: refreshToken,
          refresh_token_expires_in: refreshTokenExpiresIn ?? null,
        },
      });
    },
  },
};