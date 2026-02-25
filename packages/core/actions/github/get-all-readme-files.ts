import { createOctokit } from "../../github/octokit"


export interface AllReadmeFilesResult {
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
    readmes: string[];
}

export async function getAllReadmes(
    token: string,
    owner: string,
    repo: string,
): Promise<AllReadmeFilesResult> {

    if (!owner || !repo) {
        throw new Error("missing owner or repo");
    }

    const octokit = createOctokit(token);

    const [repoData] = await Promise.all([
        octokit.rest.repos.get({ owner, repo }),
    ]);

    const branch = await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch: repoData.data.default_branch
    })

    const treeSha = branch.data.commit.commit.tree.sha

    const tree = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: treeSha,
        recursive: "true"
    })

    const mdFilePaths = tree.data.tree
        .filter(
            item =>
                item.type === "blob" &&
                (item.path.endsWith(".md") || item.path.endsWith(".mdx"))
        )
        .map(item => item.path);

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




    return {
        metadata: repoMetadata,
        readmes: mdFilePaths,
    };
}
