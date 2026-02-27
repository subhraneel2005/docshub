import "dotenv/config"
import { generateText, Output } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from '../../prompts/system-prompt';
import { DocPlanSchema } from "../../schema/doc-plan";
import { google } from "../../lib/google";


type RepoData = {
    name: string;
    description: string;
    language: string;
    topics: string[];
    readmes: Record<string, string>;
    structure: string;
};

export async function contentGenerator(repo: RepoData) {
    try {
        const system = SYSTEM_PROMPT
            .replace("{name}", repo.name)
            .replace("{description}", repo.description)
            .replace("{language}", repo.language)
            .replace("{topics}", repo.topics.join(", "))
            .replace(
                "{readme}",
                Object.entries(repo.readmes)
                    .map(([path, content]) => `# ${path}\n\n${content}`)
                    .join("\n\n---\n\n")
            )
            .replace("{structure}", repo.structure);

        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            system,
            output: Output.object({
                schema: DocPlanSchema,
            }),
            prompt: "generate the documentation plan json",
        });

        return JSON.parse(text);
    } catch (err: any) {
        console.error("contentGenerator failed:", err?.message || err);
        throw new Error("failed to generate documentation plan");
    }
}