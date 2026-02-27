import { generateText, Output } from "ai";
import { RepoSummarySchema } from "../../schema/repo-summary";
import { google } from "../../lib/google";


type RepoData = {
    name: string;
    description: string;
    language: string;
    topics: string[];
    readmes: Record<string, string>;
    structure: string;
};



export async function repoSummariser(repo: RepoData) {

    const compiledReadmes = Object.entries(repo.readmes)
        .map(([path, content]) => {
            return `FILE: ${path}\n${content.slice(0, 8000)}`
        })
        .join("\n\n---\n\n");

    const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: `you are a senior software architect.
  compress repository data into a dense technical documentation context.
  be concise, factual, and information rich.
  no fluff or marketing language.`,
        output: Output.object({
            schema: RepoSummarySchema,
        }),
        prompt: `
  repo name: ${repo.name}
  description: ${repo.description}
  language: ${repo.language}
  topics: ${repo.topics.join(", ")}
  
  README FILES:
  ${compiledReadmes}
  
  STRUCTURE:
  ${repo.structure}
  
  generate a compressed technical summary for downstream documentation generation.
  `,
    });

    return JSON.parse(text);
}