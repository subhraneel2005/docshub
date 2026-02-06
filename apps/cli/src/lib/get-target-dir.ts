import prompts from "prompts";
import path from "path";
import process from "process";
import fs from "fs-extra";
import chalk from "chalk";

export async function getTargetDir(input?: string) {
    let projectName = input?.trim();

    // case 1 → "." or " ."
    if (projectName === ".") {
        return process.cwd();
    }

    // case 2 → nothing passed
    if (!projectName) {
        const res = await prompts({
            type: "text",
            name: "name",
            message: chalk.green("project name:"),
            initial: "project-docs"
        });

        if (!res.name) process.exit(1);

        projectName = res.name.trim();

        if (projectName === ".") {
            return process.cwd();
        }
    }

    // case 3 → folder creation
    const targetDir = path.join(process.cwd(), projectName!);

    await fs.ensureDir(targetDir);

    return targetDir;
}
