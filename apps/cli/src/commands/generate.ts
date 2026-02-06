import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

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
import { scaffoldDocs } from "@repo/core/actions/scafold/write-files";
import { createNextNextraApp } from "../lib/create-nextra-app";
import { getTargetDir } from "../lib/get-target-dir";
import { DocType } from "@repo/core/schema/doc-plan";

export async function fetchRepoFlow(token: string, cliArgProjectName?: string) {


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
    const targetDir = await getTargetDir();

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

        const plan: DocType = {
            totalPages: llmResponse.totalPages,
            structure: llmResponse.structure,
            pages: llmResponse.pages.map((p: typeof llmResponse.pages[number]) => ({
                filename: p.filename,
                title: p.title,
                description: p.description,
                sections: p.sections,
                estimatedLength: p.estimatedLength,
                path: p.path
            }))
        };
        // After generating single pages
        const singlePages = await generatePages(repoSummary, plan);
        spinner4.succeed(chalk.hex("#5FCD01")("Single pages generated successfully!"));
        console.log(`\n📄 Generated ${singlePages.pages.length} pages:`);
        singlePages.pages.forEach(p => console.log(`  - ${p.filename}`));
        console.log("\nsingle pages:\n");
        console.dir(singlePages, { depth: null });

        /* ---------- create nextra app ---------- */
        const spinner5 = ora("Creating docs project...").start();
        await createNextNextraApp(targetDir);
        spinner5.succeed("Docs project created");

        /* ---------- write mdx ---------- */
        const spinner6 = ora("Writing documentation files...").start();
        // ✅ Pass singlePages, not llmResponse.pages
        await scaffoldDocs(targetDir, singlePages);
        spinner6.succeed("Docs written successfully");

        console.log(chalk.green("\n✨ docs ready → " + targetDir));

    } catch (err: any) {
        console.log(chalk.red("failed to fetch repo"));
        console.error(err.message);
    }
}
