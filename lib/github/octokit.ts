import { Octokit } from "@octokit/rest";

export function createOctokit(githubAccessToken: string) {
  return new Octokit({
    auth: githubAccessToken,
  });
}
