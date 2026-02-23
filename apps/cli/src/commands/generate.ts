import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env"), quiet: true });

import { getRepoReadme } from "@repo/core/actions/github/get-repo-readme";
import { fetchRepoStructure } from "@repo/core/actions/github/fetch-file-tree";
import { printRepoTree } from "../lib/print-repo-tree";
import { contentGenerator } from "@repo/core/actions/ai/content-generator";
import { repoSummariser } from "@repo/core/actions/ai/repo-summarizer";
import { generatePages } from "@repo/core/actions/ai/generate-single-pages";
import { step } from "../lib/step";
import type { DocType } from "@repo/core/schema/doc-plan";

import { createCliRenderer, TextRenderable, InputRenderable, InputRenderableEvents, t, Box, CliRenderer } from "@opentui/core";
import { scaffoldDocs } from "@repo/core/actions/scafold/write-files";

export async function fetchRepoFlow(token: string, renderer: CliRenderer, cliArgProjectName?: string) {
    if (!token) {
        console.log("not logged in. run `docshub login` first.");
        return;
    }

    renderer.start();

    // Helper to prompt for input
    async function promptInput(label: string): Promise<string> {
        return new Promise((resolveInput) => {
            const labelText = new TextRenderable(renderer, {
                id: `label-${label}`,
                content: t`${label}:`,
            });
            renderer.root.add(labelText);

            const inputRenderable = new InputRenderable(renderer, {
                id: `input-${label}`,
                placeholder: `Enter ${label}...`,
                width: 50,
            });

            renderer.root.add(inputRenderable);
            inputRenderable.focus();

            inputRenderable.on(InputRenderableEvents.CHANGE, (value: string) => {
                // renderer.root.remove(labelText);
                // renderer.root.remove(inputRenderable);
                resolveInput(value.trim());
            });
        });
    }

    const owner = await promptInput("github username / org");
    const repo = await promptInput("repository name");

    try {
        await step("fetching metadata + readme...", async () => {
            const result = await getRepoReadme(token, owner, repo);

            const status = new TextRenderable(renderer, {
                id: "status-readme",
                content: t`✔ metadata + readme fetched`,
            });
            renderer.root.add(status);

            const structure = await step("analyzing repository...", () =>
                fetchRepoStructure(token, owner, repo)
            );

            const repoData = {
                name: result.metadata.name?.toString() ?? "",
                description: result.metadata.descriptions?.toString() ?? "",
                language: result.metadata.language?.toString() ?? "",
                topics: result.metadata.topics ?? [],
                readme: result.readme?.toString() ?? "",
                structure: printRepoTree(structure) ?? "",
            };

            const llmResponse = await step("generating documentation plan...", () =>
                contentGenerator(repoData)
            );

            const repoSummary = await step("generating repository summary...", () =>
                repoSummariser(repoData)
            );

            const plan: DocType = {
                totalPages: llmResponse.totalPages,
                structure: llmResponse.structure,
                pages: llmResponse.pages.map((p: any) => ({
                    filename: p.filename,
                    title: p.title,
                    description: p.description,
                    sections: p.sections,
                    estimatedLength: p.estimatedLength,
                    path: p.path,
                })),
            };

            const singlePages = await step("writing english docs...", () =>
                generatePages(repoSummary, plan)
            );

            const pagesBox = new TextRenderable(renderer, {
                id: "pages-list",
                content: t`📄 generated ${singlePages.pages.length} pages:\n${singlePages.pages
                    .map((p) => `  - ${p.filename}`)
                    .join("\n")}`,
            });
            renderer.root.add(pagesBox);

            const uniqueDir = await step("saving mdx files...", () =>
                scaffoldDocs(singlePages, "en")
            );

            const finalStatus = new TextRenderable(renderer, {
                id: "final-status",
                content: t`
✔ documentation generated
location: ${uniqueDir}
`,
            });
            renderer.root.add(finalStatus);
        });
    } catch (err: any) {
        const errorStatus = new TextRenderable(renderer, {
            id: "error-status",
            content: t`
✖ documentation generation failed
reason: ${err?.message || "unknown error"}
`,
        });
        renderer.root.add(errorStatus);
        process.exit(1);
    }
}