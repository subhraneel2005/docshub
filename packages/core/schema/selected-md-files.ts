import z from "zod";

export const SelectedMdFileSchema = z.object({
    path: z.string(),
    name: z.string(),
    isSelected: z.boolean()
})

export const SelectedMdFilesSchema = z.array(SelectedMdFileSchema);

export type SelectedMdFile = z.infer<typeof SelectedMdFileSchema>
export type SelectedMdFiles = z.infer<typeof SelectedMdFilesSchema>;