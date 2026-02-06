import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { RepoSummarySchema } from "../../schema/repo-summary";


type RepoData = {
    name: string;
    description: string;
    language: string;
    topics: string[];
    readme: string;
    structure: string;
};

export async function repoSummariser(repo: RepoData) {
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
  
  README:
  ${repo.readme.slice(0, 12000)}
  
  STRUCTURE:
  ${repo.structure}
  
  generate a compressed technical summary for downstream documentation generation.
  `,
    });

    return JSON.parse(text);
}