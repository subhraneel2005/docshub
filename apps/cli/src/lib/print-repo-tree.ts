import { RepoFile } from "@repo/core/actions/github/fetch-file-tree";
import chalk from "chalk";

export function printRepoTree(structure: RepoFile[], indent = "") {
    for (const item of structure) {
        if (item.type === "dir") {
            console.log(indent + chalk.hex("#5FCD01").bold(`📁 ${item.name}/`));
            if (item.children && item.children.length > 0) {
                printRepoTree(item.children, indent + "  "); // indent children
            }
        } else if (item.type === "file") {
            console.log(indent + chalk.hex("#5FCD01")(`-${item.name}`));
        }
    }
}