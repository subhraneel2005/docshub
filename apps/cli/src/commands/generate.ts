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
import { TextRenderable, InputRenderable, InputRenderableEvents, BoxRenderable, t, CliRenderer, Box, Text, bold, fg, dim } from "@opentui/core";
import { scaffoldDocs } from "@repo/core/actions/scafold/write-files";
import { C } from "../constants/colors";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export async function fetchRepoFlow(token: string, renderer: CliRenderer, cliArgProjectName?: string) {
    if (!token) {
        console.log("not logged in. run `docshub login` first.");
        return;
    }

    // --- Step tracker ---
    const steps: { label: string; state: "pending" | "running" | "done" | "error" }[] = [];
    let spinnerFrame = 0;
    let spinnerInterval: ReturnType<typeof setInterval> | null = null;

    const stepsText = new TextRenderable(renderer, {
        id: "steps",
        content: t``,
    });

    function renderSteps() {
        const lines = steps.map((s) => {
            if (s.state === "done") return fg(C.success)(`✔ ${s.label}`);
            if (s.state === "error") return fg(C.error)(`✖ ${s.label}`);
            if (s.state === "running") return fg(C.secondary)(`${SPINNER_FRAMES[spinnerFrame]} ${s.label}`);
            return fg("#555")(`○ ${s.label}`);
        });
        stepsText.content = t`${lines.join("\n")}`;
    }

    const stepRenderables: TextRenderable[] = [];

    function startStep(label: string) {
        steps.push({ label, state: "running" });
        const tr = new TextRenderable(renderer, {
            id: `step-${steps.length}`,
            content: t`${fg(C.secondary)("⠋ " + label)}`,
        });
        stepRenderables.push(tr);
        stepsBox.add(tr);

        if (!spinnerInterval) {
            spinnerInterval = setInterval(() => {
                spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
                const running = stepRenderables.findIndex((_, i) => steps[i]?.state === "running");
                if (
                    running !== -1 &&
                    stepRenderables[running] !== undefined &&
                    steps[running] !== undefined
                ) {
                    stepRenderables[running].content = t`${fg(C.secondary)(
                        SPINNER_FRAMES[spinnerFrame] + " " + steps[running]!.label
                    )}`;
                }
            }, 80);
        }
    }

    function completeStep(error = false) {
        const runningIndex = steps.findIndex((s) => s.state === "running");
        if (
            runningIndex !== -1 &&
            steps[runningIndex] !== undefined &&
            stepRenderables[runningIndex] !== undefined
        ) {
            steps[runningIndex]!.state = error ? "error" : "done";
            const color = error ? C.error : C.success;
            const icon = error ? "✖" : "✔";
            stepRenderables[runningIndex]!.content = t`${fg(color)(icon + " " + steps[runningIndex]!.label)}`;
        }
        if (!steps.some((s) => s.state === "running") && spinnerInterval) {
            clearInterval(spinnerInterval);
            spinnerInterval = null;
        }
    }

    const titleText = Text({ content: t`${bold(fg(C.primary)("  Docs Generator  "))}` });
    const divider = Text({ content: t`${fg("#333")("─".repeat(54))}` });
    const inputsBox = new BoxRenderable(renderer, {
        id: "inputs-section",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
        width: 56,
    });
    const stepsBox = new BoxRenderable(renderer, {
        id: "steps-section",
        flexDirection: "column",
        alignItems: "flex-start",
        width: 56,
    });

    const finalText = new TextRenderable(renderer, { id: "final", content: t`` });

    const innerBox = new BoxRenderable(renderer, {
        id: "repo-card",
        flexDirection: "column",
        alignItems: "flex-start",
        borderStyle: "rounded",
        borderColor: C.secondary,
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 2,
        paddingBottom: 2,
        gap: 1,
        width: 62,
    });

    innerBox.add(titleText);
    innerBox.add(divider);
    innerBox.add(inputsBox);
    innerBox.add(stepsBox);
    innerBox.add(finalText);

    stepsBox.add(stepsText);

    const card = Box(
        {
            id: "repo-generator-container",
            width: "100%",
            height: "50%",
            justifyContent: "center",
            alignItems: "center",
            gap: 4
        },
        innerBox
    );

    renderer.root.add(card);

    async function promptInput(label: string, isLast = false): Promise<string> {
        return new Promise((resolveInput) => {
            const labelText = new TextRenderable(renderer, {
                id: `label-${label}`,
                content: t`${fg(C.secondary)(label)}`,
            });

            const inputRenderable = new InputRenderable(renderer, {
                id: `input-${label}`,
                placeholder: `enter here...`,
                width: 54,
                backgroundColor: "#0d0d0d",
                focusedBackgroundColor: "#1a1a2e",
                textColor: C.primary,
                cursorColor: C.primary,
                paddingLeft: 1,
                paddingRight: 1,
                showCursor: true,
            });

            inputsBox.add(labelText);
            inputsBox.add(inputRenderable);
            if (!isLast) {
                inputsBox.add(new TextRenderable(renderer, { id: `gap-${label}`, content: t`` }));
            }

            inputRenderable.focus();

            inputRenderable.on(InputRenderableEvents.ENTER, (value: string) => {
                resolveInput(value.trim());
            });
        });
    }

    const owner = await promptInput("github username / org");
    const repo = await promptInput("repository name", true);

    // Divider before steps
    inputsBox.add(new TextRenderable(renderer, {
        id: "divider2", content: t`${"─".repeat(54)}`
    }));

    try {
        startStep("fetching metadata + readmes");
        const result = await getRepoReadme(token, owner, repo);
        completeStep();

        startStep("analyzing repository structure");
        const structure = await fetchRepoStructure(token, owner, repo);
        completeStep();

        const repoData = {
            name: result.metadata.name?.toString() ?? "",
            description: result.metadata.descriptions?.toString() ?? "",
            language: result.metadata.language?.toString() ?? "",
            topics: result.metadata.topics ?? [],
            readme: result.readme?.toString() ?? "",
            structure: printRepoTree(structure) ?? "",
        };

        startStep("generating documentation plan");
        const llmResponse = await contentGenerator(repoData);
        completeStep();

        startStep("summarising repository");
        const repoSummary = await repoSummariser(repoData);
        completeStep();

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

        startStep("writing documentation pages");
        const singlePages = await generatePages(repoSummary, plan);
        completeStep();

        startStep("saving mdx files");
        const uniqueDir = await scaffoldDocs(singlePages, "en");
        completeStep();

        finalText.content = t`${fg(C.success)(bold("✔ documentation ready!"))}\nsaved to: ${fg(C.primary)(uniqueDir)}\n${singlePages.pages.length} pages generated`;

    } catch (err: any) {
        completeStep(true);
        finalText.content = t`
${fg("#333")("─".repeat(54))}
${fg(C.error)(bold("✖ generation failed"))}
${fg("#888")(err?.message || "unknown error")}`;
    }
}