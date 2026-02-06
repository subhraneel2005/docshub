import { z } from "zod"

const DocPlanSchema = z.object({
    totalPages: z.number(),
    structure: z.union([z.literal("flat"), z.literal("nested")]),
    pages: z.array(
        z.object({
            filename: z.string(),
            title: z.string(),
            description: z.string(),
            sections: z.array(z.string()),
            estimatedLength: z.union([
                z.literal("short"),
                z.literal("medium"),
                z.literal("long"),
            ]),
            path: z.string().optional(),
        })
    ),
});

export { DocPlanSchema }
export type DocType = z.infer<typeof DocPlanSchema>;