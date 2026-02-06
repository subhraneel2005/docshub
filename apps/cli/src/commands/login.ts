import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });


import chalk from "chalk";
import boxen from "boxen";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

const brand = chalk.hex("#5FCD01");

export async function login() {
    const auth = createOAuthDeviceAuth({
        clientId: "Ov23lipvLXeJE8bAsdfT",
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
            brand.bold("authentication successfull"),
            {
                padding: 1,
                borderStyle: "round",
                borderColor: "#5FCD01",
            }
        )
    );

    console.log(chalk.gray("token:"), brand(result.token));
    return result.token;
}
