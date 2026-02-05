import { createOctokit } from "../../github/octokit";
import type { Endpoints } from "@octokit/types";

export interface RepoFile {
    name: string;
    path: string;
    type: "file" | "dir";
    content?: string;
    children?: RepoFile[];
}

type GetContentData = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];

export async function fetchRepoStructure(
    token: string,
    owner: string,
    repo: string,
    path = ""
): Promise<RepoFile[]> {
    const octokit = createOctokit(token);

    let data: GetContentData;
    try {
        const res = await octokit.rest.repos.getContent({ owner, repo, path });
        data = res.data;
    } catch (err: any) {
        if (err.status === 401 || err.status === 403) {
            console.log(`⚠ Skipping inaccessible: ${path}`);
            return [];
        }
        throw err;
    }

    const entries = Array.isArray(data) ? data : [data];

    const result: RepoFile[] = [];

    for (const item of entries) {
        if (item.type === "dir") {
            const children = await fetchRepoStructure(token, owner, repo, item.path);
            result.push({ name: item.name, path: item.path, type: "dir", children });
        } else if (item.type === "file") {
            let content = "";
            if (item.size < 1_000_000) {
                try {
                    const fileRes = await octokit.rest.repos.getContent({
                        owner,
                        repo,
                        path: item.path,
                    });
                    if (!Array.isArray(fileRes.data) && "content" in fileRes.data) {
                        content = Buffer.from(fileRes.data.content || "", "base64").toString("utf-8");
                    }
                } catch {
                    console.log(`⚠ Skipping file content: ${item.path}`);
                }
            }
            result.push({ name: item.name, path: item.path, type: "file", content });
        }
    }

    return result;
}
