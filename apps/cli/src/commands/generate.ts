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
import { getTargetDir } from "../lib/get-target-dir";
import { DocType } from "@repo/core/schema/doc-plan";
import { runLingoTranslations } from "../lib/run-lingo-translations";
import { step } from "../lib/step";

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

    try {
        const result = await getRepoReadme(token, owner, repo);

        console.log(chalk.green("✔ metadata + readme fetched"));

        const structure = await step(
            "analyzing repository...",
            () => fetchRepoStructure(token, owner, repo)
        );

        const repoData = {
            name: result.metadata.name?.toString() ?? "",
            description: result.metadata.descriptions?.toString() ?? "",
            language: result.metadata.language?.toString() ?? "",
            topics: result.metadata.topics ?? [],
            readme: result.readme?.toString() ?? "",
            structure: printRepoTree(structure) ?? ""
        };

        const llmResponse = await step(
            "generating documentation plan...",
            () => contentGenerator(repoData)
        );

        const repoSummary = await step(
            "generating repository summary...",
            () => repoSummariser(repoData)
        );




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

        const singlePages = await step(
            "writing english docs...",
            () => generatePages(repoSummary, plan)
        );

        console.log(`\n📄 generated ${singlePages.pages.length} pages:`);
        singlePages.pages.forEach(p => console.log(`  - ${p.filename}`));


        /* ---------- write mdx ---------- */
        const uniqueDir = await step(
            "saving mdx files...",
            () => scaffoldDocs(singlePages, "en")
        );


        /* ---------- tranlate using lingo-cli ---------- */
        await step(
            "translating with lingo.dev...",
            () =>
                runLingoTranslations(
                    { targets: ["es", "fr", "de", "ja", "hi"] },
                    uniqueDir
                )
        );

        console.log(`
            ${chalk.green("✔ documentation generated")}
            ${chalk.gray("location:")} ${uniqueDir}
            ${chalk.gray("languages:")} en, es, fr, de, ja, hi
            `);



    } catch (err: any) {
        console.log(`
            ${chalk.red("✖ documentation generation failed")}
            ${chalk.gray("reason:")} ${err?.message || "unknown error"}
            `);
        process.exit(1);

    }
}
