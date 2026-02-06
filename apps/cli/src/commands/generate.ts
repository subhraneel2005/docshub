import "dotenv/config"

import prompts from "prompts";
import chalk from "chalk";
import { getRepoReadme } from "@repo/core/actions/github/get-repo-readme";
import { fetchRepoStructure } from "@repo/core/actions/github/fetch-file-tree";
import { printRepoTree } from "../lib/print-repo-tree";
import boxen from "boxen";
import ora from "ora";
import { contentGenerator } from "@repo/core/actions/ai/content-generator";
import { repoSummariser } from "@repo/core/actions/ai/repo-summarizer"
import { generatePages } from "@repo/core/actions/ai/generate-single-pages"

export async function fetchRepoFlow(token: string) {


    if (!token) {
        console.log(chalk.red("not logged in. run `docshub login` first."));
        return;
    }

    const response = await prompts([
        {
            type: "text",
            name: "owner",
            message: chalk.hex("#5FCD01").bold("github username / org:"),
            validate: (v) => (v ? true : "required"),
        },
        {
            type: "text",
            name: "repo",
            message: chalk.hex("#5FCD01").bold("repository name:"),
            validate: (v) => (v ? true : "required"),
        },
    ]);


    const { owner, repo } = response;

    try {
        const result = await getRepoReadme(token, owner, repo);

        console.log(
            boxen(chalk.hex("#5FCD01").bold("REPO METADATA"), { padding: 1, borderColor: "#5FCD01" })
        );
        console.log(result.metadata);

        console.log(
            boxen(chalk.hex("#5FCD01").bold("README"), { padding: 1, borderColor: "#5FCD01" })
        );
        console.log(result.readme);

        console.log(
            boxen(chalk.hex("#5FCD01").bold("REPO FOLDER STRUCTURE"), { padding: 1, borderColor: "#5FCD01" })
        );
        const spinner = ora({ text: chalk.hex("#5FCD01")("Fetching folder structure...") }).start();
        const structure = await fetchRepoStructure(token, owner, repo);
        spinner.succeed(chalk.hex("#5FCD01")("Folder structure fetched successfully!"));
        printRepoTree(structure);

        const repoData = {
            name: result.metadata.name?.toString() ?? "",
            description: result.metadata.descriptions?.toString() ?? "",
            language: result.metadata.language?.toString() ?? "",
            topics: result.metadata.topics ?? [],
            readme: result.readme?.toString() ?? "",
            structure: printRepoTree(structure) ?? ""
        };

        console.log("\nrepodata:\n");
        console.dir(repoData, { depth: null });

        const spinner2 = ora({ text: chalk.hex("#5FCD01")("AI is generating docs content...") }).start();
        const llmResponse = await contentGenerator(repoData);
        spinner2.succeed(chalk.hex("#5FCD01")("Docs content generated successfully!"));

        console.log("\nllm response:\n");
        console.dir(llmResponse, { depth: null });

        const spinner3 = ora({ text: chalk.hex("#5FCD01")("Generating AI summary...") }).start();
        const repoSummary = await repoSummariser(repoData);
        spinner3.succeed(chalk.hex("#5FCD01")("AI Summary generated successfully!"));

        console.log("\nrepo summary:\n");
        console.dir(repoSummary, { depth: null });

        const spinner4 = ora({ text: chalk.hex("#5FCD01")("Generating single pages...") }).start();
        const singlePages = await generatePages(repoSummary, llmResponse.pages);
        spinner4.succeed(chalk.hex("#5FCD01")("Single pages generated successfully!"));

        console.log("\nsingle pages:\n");
        console.dir(singlePages, { depth: null });

    } catch (err: any) {
        console.log(chalk.red("failed to fetch repo"));
        console.error(err.message);
    }
}
