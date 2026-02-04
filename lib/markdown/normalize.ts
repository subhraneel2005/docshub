import { visit } from "unist-util-visit";
import type { Root, Heading, Image, PhrasingContent, Text } from "mdast";

export function normalize(tree: Root): Root {
    let firstH2Found = false;

    // remove top badges (images before first ##)
    visit(tree, (node, index, parent) => {
        if (!parent || index == null) return;

        if (node.type === "heading" && (node as Heading).depth === 2) {
            firstH2Found = true;
        }

        if (!firstH2Found && node.type === "image") {
            parent.children.splice(index, 1);
        }
    });

    // trim heading text
    visit(tree, "heading", (node: Heading) => {
        node.children.forEach((child: PhrasingContent) => {
            if (child.type === "text") {
                (child as Text).value = child.value.trim();
            }
        });
    });

    return tree;
}
