import type { RepoFile } from "@subhraneel2005/docshub-core/actions/github/fetch-file-tree";


export function printRepoTree(structure: RepoFile[], indent = ""): string {
    let output = "";

    for (const item of structure) {
        if (item.type === "dir") {
            output += `${indent}📁 ${item.name}/\n`;
            if (item.children && item.children.length > 0) {
                output += printRepoTree(item.children, indent + "  "); // indent children
            }
        } else if (item.type === "file") {
            output += `${indent}-${item.name}\n`;
        }
    }

    return output;
}
