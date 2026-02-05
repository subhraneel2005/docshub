import type { Root, Content, Heading } from "mdast";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

export interface Section {
    slug: string;
    title: string;
    nodes: Content[];
    parent?: string;
}

export function splitSections(tree: Root): Section[] {
    const sections: Section[] = [];

    // Return a single section containing all content
    const singleSection: Section = {
        slug: "index",
        title: "Documentation",
        nodes: tree.children,
    };

    sections.push(singleSection);

    return sections;
}
