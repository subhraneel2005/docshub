import { unified } from "unified";
import remarkStringify from "remark-stringify";
import type { Content } from "mdast";

export interface Page {
    slug: string;
    title: string;
    nodes: Content[];
    parent?: string;
}

export interface BuiltPage {
    slug: string;
    title: string;
    parent?: string;
    content: string;
}

export async function frontmatter(pages: Page[]): Promise<BuiltPage[]> {
    const processor = unified().use(remarkStringify);

    const result: BuiltPage[] = [];

    for (const page of pages) {
        const body = String(
            processor.stringify({
                type: "root",
                children: page.nodes,
            } as any)
        );

        const mdx = `---
title: ${page.title}
---

${body}`;

        result.push({
            slug: page.slug,
            title: page.title,
            parent: page.parent,
            content: mdx,
        });
    }

    return result;
}
