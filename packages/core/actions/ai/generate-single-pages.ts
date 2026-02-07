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

OUTPUT STRICT VALID MDX:
- markdown + JSX allowed
- use fenced code blocks
- allow imports/components if useful

write like official developer docs.
structured, technical, clear.`,
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
- output STRICT VALID MDX
- no frontmatter
- use mdx compatible syntax
- support JSX components if needed
- 1000–1800 words
- ## main sections
- ### subsections
- code examples when relevant

`
        });

        generatedPages.push(output as GeneratedPage);
        console.log(`generated: ${pageSpec.filename}`);
    }

    return { pages: generatedPages };
}