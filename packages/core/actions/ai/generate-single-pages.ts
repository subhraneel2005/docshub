import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

/* ---------- schemas ---------- */

export const GeneratedPageSchema = z.object({
    filename: z.string(),
    title: z.string(),
    description: z.string(),
    sections: z.array(z.string()),
    estimatedLength: z.enum(["short", "medium", "long"]),
    path: z.string().optional()
});

export const GeneratedPagesSchema = z.object({
    pages: z.array(GeneratedPageSchema)
});

export type GeneratedPages = z.infer<typeof GeneratedPagesSchema>;

/* ---------- types ---------- */

type RepoSummary = Record<string, unknown>;

type DocPlan = {
    pages: {
        filename: string;
        title: string;
        description: string;
        sections: string[];
        estimatedLength: string;
    }[];
};

/* ---------- generator ---------- */

export async function generatePages(summary: RepoSummary, plan: DocPlan) {
    const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: `you are a senior technical documentation writer.
generate full markdown documentation pages.
clear structure. developer focused.`,
        output: Output.object({
            schema: GeneratedPagesSchema
        }),
        prompt: `
REPOSITORY SUMMARY:
${JSON.stringify(summary)}

DOC PLAN:
${JSON.stringify(plan.pages)}

requirements:
- generate full markdown pages
- 1000–1800 words per page
- proper headings
- include examples if relevant
`
    });

    return JSON.parse(text) as GeneratedPages;
}
