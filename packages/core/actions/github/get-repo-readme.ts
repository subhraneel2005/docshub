import { createOctokit } from "../../github/octokit"


export interface RepoReadmeResult {
    metadata: {
        name: string;
        gitUrl: string;
        htmlUrl: string;
        cloneUrl: string;
        descriptions: string | null;
        hasIssues: boolean;
        hasProjects: boolean;
        language: string | null;
        topics: string[] | undefined;
        forksCount: number;
        defaultBranch: string;
    };
    readme: string;
}

export async function getRepoReadme(
    token: string,
    owner: string,
    repo: string
): Promise<RepoReadmeResult> {
    if (!owner || !repo) {
        throw new Error("missing owner or repo");
    }

    const octokit = createOctokit(token);


    const [readme, repoData] = await Promise.all([
        octokit.rest.repos.getReadme({ owner, repo }),
        octokit.rest.repos.get({ owner, repo }),
    ]);

    const repoMetadata = {
        name: repoData.data.full_name,
        gitUrl: repoData.data.git_url,
        htmlUrl: repoData.data.html_url,
        cloneUrl: repoData.data.clone_url,
        descriptions: repoData.data.description,
        hasIssues: repoData.data.has_issues,
        hasProjects: repoData.data.has_projects,
        language: repoData.data.language,
        topics: repoData.data.topics,
        forksCount: repoData.data.forks_count,
        defaultBranch: repoData.data.default_branch,
    };

    const decodedReadmeContent = Buffer.from(
        readme.data.content,
        "base64"
    ).toString("utf-8");

    return {
        metadata: repoMetadata,
        readme: decodedReadmeContent,
    };
}
