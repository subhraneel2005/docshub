import { getGithubAccessToken } from "@/lib/actions/get-github-token";
import { API_ERRORS } from "@/lib/api/errors";
import { createOctokit } from "@/lib/github/octokit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const githubAccessToken = await getGithubAccessToken()

    const octokit = createOctokit(githubAccessToken);

    const { owner, repo } = await req.json();

    if (!owner || !repo) {
        return NextResponse.json({ error: API_ERRORS.MISSING_REQUIRED_FIELDS.message }, { status: API_ERRORS.MISSING_REQUIRED_FIELDS.status })
    }

    // const defaultOptions = octokit.rest.repos.get.endpoint.DEFAULTS;
    const readme = await octokit.rest.repos.getReadme({
        owner,
        repo
    })

    const repoData = await octokit.rest.repos.get({
        owner,
        repo
    })

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
        defaultBranch: repoData.data.default_branch
    }

    const decodedReadmeContent = Buffer.from(readme.data.content, "base64").toString("utf-8");


    return NextResponse.json({
        success: true, data: {
            data: {
                metadata: repoMetadata,
                readme: decodedReadmeContent
            }
        },
        status: 200
    })
}