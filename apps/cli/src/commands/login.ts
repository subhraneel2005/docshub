import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env"), quiet: true });

import chalk from "chalk";
import ora from "ora";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { CONFIG } from "@repo/core/config/env";

export async function login() {

    const spinner = ora(chalk.cyan("starting github device auth...")).start();

    process.on("SIGINT", () => {
        spinner.stop();
        console.log(chalk.red("\n✖ cancelled by user"));
        process.exit(0);
    });

    const auth = createOAuthDeviceAuth({
        clientId: CONFIG.GITHUB_OAUTH_CLIENT_ID,
        scopes: ["repo", "read:user"],
        onVerification: ({ verification_uri, user_code }) => {
            spinner.stop();

            console.log("\n" + chalk.green("github login required"));
            console.log(chalk.gray("open: "), chalk.underline(verification_uri));
            console.log(chalk.gray("code: "), chalk.yellow(user_code) + "\n");

            spinner.start(chalk.cyan("waiting for authentication..."));
        },
    });

    try {
        const result = await auth({ type: "oauth" });

        spinner.succeed(chalk.green("✔ authentication complete"));

        console.log(`
${chalk.green("✔ github connected")}
${chalk.gray("status:")} ready
`);

        return result.token;
    } catch (err: any) {
        spinner.fail(chalk.red("authentication failed"));
        throw err;
    }
}
