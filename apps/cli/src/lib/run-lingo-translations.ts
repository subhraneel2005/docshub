import fs from "fs-extra";
import { execa } from "execa";
import chalk from "chalk";
import path from "path";

type LingoOptions = {
    targets?: string[];
    source?: string;
};

export async function runLingoTranslations(
    opts: LingoOptions = {},
    baseDir: string,
) {
    const source = opts.source ?? "en";
    const targets = opts.targets ?? ["es", "fr", "de", "ja", "hi"];

    console.log(chalk.blue("\n🌍 setting up lingo translation..."));

    const targetDir = path.join(process.cwd(), baseDir);

    const config = {
        $schema: "https://lingo.dev/schema/i18n.json",
        version: "1.10",
        locale: {
            source,
            targets
        },
        buckets: {
            markdown: {
                include: ["./[locale]/*.mdx"]
            }
        }
    };

    await fs.writeJson(
        path.join(targetDir, "i18n.json"),
        config,
        { spaces: 2 }
    );

    // Try to run, if auth fails, trigger login
    try {
        console.log(chalk.yellow("🚀 running lingo translations..."));
        await execa("npx", ["-y", "lingo.dev", "run"], {
            cwd: targetDir,
            stdio: "inherit",
        });
    } catch (error: any) {
        if (error.message.includes("Authentication failed") || error.exitCode === 1) {
            console.log(chalk.yellow("\n🔐 authentication required. starting login flow...\n"));

            // Trigger login
            await execa("npx", ["-y", "lingo.dev", "login"], {
                stdio: "inherit",
            });

            console.log(chalk.yellow("\n🚀 retrying translation..."));

            // Retry after login
            await execa("npx", ["-y", "lingo.dev", "run"], {
                cwd: targetDir,
                stdio: "inherit",
            });
        } else {
            throw error;
        }
    }

    console.log(chalk.green("\n✅ translations generated:"));
    targets.forEach((l) => console.log(`  - ${l}`));
}