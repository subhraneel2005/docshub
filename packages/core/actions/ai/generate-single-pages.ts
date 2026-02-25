import { generateText, Output } from "ai";
import { GeneratedPageSchema, type GeneratedPage, type GeneratedPages } from "../../schema/single-doc-page";
import type { DocType } from "../../schema/doc-plan";
import type { RepoSummary } from "../../schema/repo-summary";
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
- NO imports needed - components are auto-available

AVAILABLE COMPONENTS (use without importing):

1. CALLOUTS - for warnings, tips, notes:
<Callout>
  <CalloutTitle>Important Note</CalloutTitle>
  <CalloutDescription>This is a callout message</CalloutDescription>
</Callout>

2. CARDS - for links, features, navigation:
<Cards>
  <Card title="Title" href="/link" />
  <Card title="Another" href="/other" />
</Cards>

3. CODE TABS - for multi-language examples:
<CodeBlockTabs>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="js">JavaScript</CodeBlockTabsTrigger>
    <CodeBlockTabsTrigger value="ts">TypeScript</CodeBlockTabsTrigger>
  </CodeBlockTabsList>
  <CodeBlockTab value="js">
\`\`\`js
console.log('hello');
\`\`\`
  </CodeBlockTab>
  <CodeBlockTab value="ts">
\`\`\`ts
console.log('hello');
\`\`\`
  </CodeBlockTab>
</CodeBlockTabs>

USE THESE COMPONENTS when they enhance clarity:
- Callouts for important warnings, tips, prerequisites
- Cards for related links, next steps, feature grids
- CodeBlockTabs for showing same code in multiple languages

write like official developer docs: structured, technical, clear.`,
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

REQUIREMENTS:
- output STRICT VALID MDX
- no frontmatter
- use mdx compatible syntax
- NO component imports needed (auto-available)
- use Callout, Cards, CodeBlockTabs where appropriate
- 1000–1800 words
- ## main sections
- ### subsections
- code examples when relevant
- enhance with components for better UX

COMPONENT USAGE EXAMPLES:
- Use <Callout> for prerequisites, warnings, important notes
- Use <Cards> for navigation to related docs or feature highlights
- Use <CodeBlockTabs> when showing multiple language/framework examples
`
    });

    generatedPages.push(output as GeneratedPage);
    console.log(`generated: ${pageSpec.filename}`);
  }

  return { pages: generatedPages };
}