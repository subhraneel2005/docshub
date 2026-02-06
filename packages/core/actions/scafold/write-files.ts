import path from "path";
import fs from "fs-extra";
import { GeneratedPages } from "../../schema/single-doc-page";
import chalk from "chalk"

export type GeneratedDocs = {
    pages: GeneratedPages["pages"];
};

export async function scaffoldDocs(dir: string, docs: GeneratedPages) {
    const contentDir = path.join(dir, "content", "en");

    await fs.ensureDir(contentDir);

    // meta
    const meta = docs.pages.map((p) => ({
        title: p.title,
        route: "/" + p.filename.replace(".mdx", ""),
    }));

    await fs.writeFile(
        path.join(contentDir, "_meta.js"),
        `export default ${JSON.stringify(meta, null, 2)}`
    );

    // pages
    for (const page of docs.pages) {
        console.log(chalk.cyan(`Writing ${page.filename}...`)); // Add logging

        // ✅ content is now available from singlePages
        await fs.writeFile(
            path.join(contentDir, page.filename),
            page.content // This now exists because singlePages has it
        );
    }

    console.log(chalk.green(`\n✅ Wrote ${docs.pages.length} pages`));
}