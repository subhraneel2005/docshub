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
    const slugger = new GithubSlugger();

    let currentH2: Section | null = null;
    let currentSection: Section | null = null;

    for (const node of tree.children) {
        if (node.type === "heading") {
            const h = node as Heading;
            const title = toString(h).trim();
            const slug = slugger.slug(title);

            if (h.depth === 2) {
                currentH2 = { slug, title, nodes: [] };
                currentSection = currentH2;
                sections.push(currentSection);
                continue;
            }

            if (h.depth === 3 && currentH2) {
                currentSection = {
                    slug,
                    title,
                    nodes: [],
                    parent: currentH2.slug,
                };
                sections.push(currentSection);
                continue;
            }
        }

        if (currentSection) {
            currentSection.nodes.push(node);
        }
    }

    // remove empty parent/container sections
    const hasChildren = new Set(
        sections.filter(s => s.parent).map(s => s.parent!)
    );

    return sections.filter(s => {
        if (s.nodes.length > 0) return true;
        if (!hasChildren.has(s.slug)) return true;
        return false; // empty parent → skip
    });
}
