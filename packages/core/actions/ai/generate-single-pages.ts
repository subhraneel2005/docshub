import { generateText, Output } from "ai";
import { GeneratedPage, GeneratedPages, GeneratedPagesSchema, GeneratedPageSchema } from "../../schema/single-doc-page";
import { DocType } from "../../schema/doc-plan";
import { RepoSummary } from "../../schema/repo-summary";
import { google } from "../../lib/google";

export async function generatePages(summary: RepoSummary, plan: DocType): Promise<GeneratedPages> {
    const generatedPages: GeneratedPage[] = [];

    // ✅ Generate each page individually
    for (const pageSpec of plan.pages) {
        const { output } = await generateText({
            model: google("gemini-2.5-flash"),
            system: `you are a senior technical documentation writer.
generate full MDX documentation pages.
developer focused. structured.`,
            output: Output.object({
                schema: GeneratedPageSchema  // ✅ Single page schema
            }),
            prompt: `
REPOSITORY SUMMARY:
${JSON.stringify(summary)}

GENERATE THIS PAGE:
Filename: ${pageSpec.filename}
Title: ${pageSpec.title}
Description: ${pageSpec.description}
Sections: ${pageSpec.sections.join(", ")}
Length: ${pageSpec.estimatedLength}

requirements:
- generate FULL MDX content (do NOT include frontmatter, we'll add it separately)
- 1000–1800 words
- proper headings (## for main sections, ### for subsections)
- include code examples if relevant
- use the sections list as a guide for structure
`
        });

        generatedPages.push(output as GeneratedPage);
        console.log(`✅ Generated: ${pageSpec.filename}`);
    }

    return { pages: generatedPages };
}