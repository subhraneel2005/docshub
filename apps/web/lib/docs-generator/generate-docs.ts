import { parse } from "../markdown/parse";
import { normalize } from "../markdown/normalize";
import { splitSections } from "../markdown/split-sections";
import { frontmatter } from "../markdown/frontmatter";
import { buildMeta } from "../markdown/meta";

export interface GeneratedDoc {
    slug: string;
    title: string;
    parent?: string;
    content: string;
}

export interface GeneratedDocsResult {
    pages: GeneratedDoc[];
    meta: {
        root: Record<string, string>;
        nested: Record<string, Record<string, string>>;
    };
}

export async function generateDocs(
    readme: string
): Promise<GeneratedDocsResult> {
    // 1. parse → AST
    const ast = await parse(readme);

    // 2. normalize AST
    const normalized = normalize(ast);

    // 3. split into sections
    const sections = splitSections(normalized);

    // 4. add frontmatter + stringify mdx
    const pages = await frontmatter(sections);

    // 5. build meta structure
    const meta = buildMeta(pages);

    return {
        pages,
        meta,
    };
}
