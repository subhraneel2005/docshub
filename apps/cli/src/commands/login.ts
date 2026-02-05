import "dotenv/config";
import chalk from "chalk";
import boxen from "boxen";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

const brand = chalk.hex("#5FCD01");

export async function login() {
    const auth = createOAuthDeviceAuth({
        clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
        scopes: ["repo", "read:user"],
        onVerification: ({ verification_uri, user_code }) => {
            console.log(
                boxen(
                    [
                        brand.bold("DOCSHUB LOGIN"),
                        "",
                        chalk.white("1. open: ") + chalk.underline(verification_uri),
                        chalk.white("2. enter code: ") + brand.bold(user_code),
                    ].join("\n"),
                    {
                        padding: 1,
                        borderStyle: "round",
                        borderColor: "#5FCD01",
                    }
                )
            );
        },
    });

    const result = await auth({ type: "oauth" });

    console.log(
        boxen(
            brand.bold("✓ authenticated with github"),
            {
                padding: 1,
                borderStyle: "round",
                borderColor: "#5FCD01",
            }
        )
    );

    console.log(chalk.gray("token:"), brand(result.token));
}
