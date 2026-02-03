"use server"

import { getServerSession } from "next-auth";
import { prisma } from "../db/prisma";
import { authOptions } from "../auth/next-auth";
import { API_ERRORS } from "../api/errors";

export async function getGithubAccessToken(){
    const session = await getServerSession(authOptions);

if (!session?.user?.email) {
throw new Error(API_ERRORS.UNAUTHORIZED.message)
}

const githubAccount = await prisma.githubAccount.findFirst({
  where: {
    user: {
      email: session.user.email,
    },
  },
  select: {
    accessToken: true,
  },
});

if (!githubAccount) {
    throw new Error(API_ERRORS.GITHUB_NOT_LINKED.message)
}

return githubAccount.accessToken;
}
