import { Octokit } from "@octokit/rest";
import type { OctokitResponse } from "@octokit/types";

export function createOctokit(githubAccessToken: string): Octokit {
  return new Octokit({
    auth: githubAccessToken,
  });
}
