import z from "zod";

export const RepoSummarySchema = z.object({
    overview: z.string(),
    coreFeatures: z.array(z.string()),
    techStack: z.array(z.string()),
    architecture: z.string(),
    importantFiles: z.array(z.string()),
    setupSteps: z.array(z.string()),
    limitations: z.array(z.string()),
    targetUsers: z.array(z.string()),
});

export type RepoSummary = z.infer<typeof RepoSummarySchema>;