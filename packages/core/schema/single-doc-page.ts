import { z } from "zod";  // ✅ Named import

export const GeneratedPageSchema = z.object({
    filename: z.string(),
    title: z.string(),
    description: z.string(),
    content: z.string()
});

export const GeneratedPagesSchema = z.object({
    pages: z.array(GeneratedPageSchema)
});

// Types
export type GeneratedPage = z.infer<typeof GeneratedPageSchema>;
export type GeneratedPages = z.infer<typeof GeneratedPagesSchema>;