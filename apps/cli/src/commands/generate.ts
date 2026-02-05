import prompts from "prompts";
import chalk from "chalk";
import { getRepoReadme } from "@repo/core/actions/github/get-repo-readme";

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

        console.log(chalk.hex("#5FCD01").bold("\nrepo metadata:\n"));
        console.log(result.metadata);

        console.log(chalk.hex("#5FCD01").bold("\nreadme:\n"));
        console.log(result.readme);
    } catch (err: any) {
        console.log(chalk.red("failed to fetch repo"));
        console.error(err.message);
    }
}
