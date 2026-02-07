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
        path.join(process.cwd(), baseDir, "i18n.json"),
        config,
        { spaces: 2 }
    );


    console.log(chalk.yellow("🚀 running lingo..."));

    await execa("pnpm", ["exec", "lingo.dev", "run"], {
        cwd: path.join(process.cwd(), baseDir),
        stdio: "inherit",
    });

    console.log(chalk.green("\n✅ translations generated:"));
    targets.forEach((l) => console.log(`docs/${l}`));
}
