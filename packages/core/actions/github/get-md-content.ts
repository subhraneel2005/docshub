import { createOctokit } from "../../github/octokit";

interface GetMdContentProps {
    token: string,
    repo: string,
    owner: string,
    path: string
}

export async function getMdContent({ token, repo, owner, path }: GetMdContentProps) {

    if (!token || !repo || !owner || !path) {
        throw new Error("missing owner or repo or token path");
    }

    const octokit = createOctokit(token);
    try {
        const res = await octokit.repos.getContent({ owner, repo, path })

        if (Array.isArray(res.data)) {
            throw new Error("Path is a directory");
        }

        if (res.data.type !== "file") {
            throw new Error("Not a file");
        }

        const decodedReadmeContent = Buffer.from(
            res.data.content,
            "base64"
        ).toString("utf-8");
        return decodedReadmeContent
    } catch (error) {
        console.error(`Error getting md content: ${error}`)
    }
}