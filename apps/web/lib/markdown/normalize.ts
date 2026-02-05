import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import type { Root, Heading, Image, PhrasingContent, Text, Blockquote, Code, Link, List, ListItem } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";

export function normalize(tree: Root): Root {
    let firstH2Found = false;
    const slugger = new GithubSlugger();

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

    // transform blockquotes to Callout components
    // Note: This will be handled in post-processing in frontmatter.ts
    // visit(tree, "blockquote", (node: Blockquote, index, parent) => {
    //     if (!parent || index == null) return;

    //     const calloutNode: MdxJsxFlowElement = {
    //         type: "mdxJsxFlowElement",
    //         name: "Callout",
    //         attributes: [],
    //         children: node.children as any,
    //     };
    //     parent.children.splice(index, 1, calloutNode);
    // });

    // transform code blocks to syntax highlighted components
    // Note: This will be handled in post-processing in frontmatter.ts
    // visit(tree, "code", (node: Code, index, parent) => {
    //     if (!parent || index == null) return;

    //     const preNode: MdxJsxFlowElement = {
    //         type: "mdxJsxFlowElement",
    //         name: "pre",
    //         attributes: node.lang ? [{ type: "mdxJsxAttribute", name: "data-language", value: node.lang }] : [],
    //         children: [{
    //             type: "mdxJsxFlowElement",
    //             name: "code",
    //             attributes: node.lang ? [{ type: "mdxJsxAttribute", name: "data-language", value: node.lang }] : [],
    //             children: [{ type: "text", value: node.value }]
    //         }] as any,
    //     };
    //     parent.children.splice(index, 1, preNode);
    // });

    // add anchor links to headings
    // Note: This will be handled by Nextra's theme
    // visit(tree, "heading", (node: Heading, index, parent) => {
    //     if (!parent || index == null) return;

    //     const headingText = toString(node);
    //     const slug = slugger.slug(headingText);

    //     // Create anchor link element
    //     const anchorNode: MdxJsxTextElement = {
    //         type: "mdxJsxTextElement",
    //         name: "a",
    //         attributes: [
    //             { type: "mdxJsxAttribute", name: "href", value: `#${slug}` },
    //             { type: "mdxJsxAttribute", name: "className", value: "anchor" }
    //         ],
    //         children: [{ type: "text", value: "#" }] as any,
    //     };

    //     // Add anchor to the end of heading children
    //     node.children.push(anchorNode);
    // });

    return tree;
}
