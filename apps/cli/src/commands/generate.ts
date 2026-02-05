import prompts from "prompts";
import chalk from "chalk";
import { getRepoReadme } from "@repo/core/actions/github/get-repo-readme";
import { fetchRepoStructure } from "@repo/core/actions/github/fetch-file-tree";
import { printRepoTree } from "../lib/print-repo-tree";
import boxen from "boxen";
import ora from "ora";

export async function fetchRepoFlow(token: string) {


    if (!token) {
        console.log(chalk.red("not logged in. run `docshub login` first."));
        return;
    }

    const response = await prompts([
        {
            type: "text",
            name: "owner",
            message: chalk.hex("#5FCD01").bold("github username / org:"),
            validate: (v) => (v ? true : "required"),
        },
        {
            type: "text",
            name: "repo",
            message: chalk.hex("#5FCD01").bold("repository name:"),
            validate: (v) => (v ? true : "required"),
        },
    ]);


    const { owner, repo } = response;

    try {
        const result = await getRepoReadme(token, owner, repo);

        console.log(
            boxen(chalk.hex("#5FCD01").bold("REPO METADATA"), { padding: 1, borderColor: "#5FCD01" })
        );
        console.log(result.metadata);

        console.log(
            boxen(chalk.hex("#5FCD01").bold("README"), { padding: 1, borderColor: "#5FCD01" })
        );
        console.log(result.readme);

        console.log(
            boxen(chalk.hex("#5FCD01").bold("REPO FOLDER STRUCTURE"), { padding: 1, borderColor: "#5FCD01" })
        );
        const spinner = ora({ text: chalk.hex("#5FCD01")("Fetching folder structure...") }).start();
        const structure = await fetchRepoStructure(token, owner, repo);
        spinner.succeed(chalk.hex("#5FCD01")("Folder structure fetched successfully!"));
        printRepoTree(structure);
    } catch (err: any) {
        console.log(chalk.red("failed to fetch repo"));
        console.error(err.message);
    }
}
