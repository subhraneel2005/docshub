import path from "path";
import fs from "fs-extra";
import type { GeneratedPages } from "../../schema/single-doc-page";
import chalk from "chalk";

export async function scaffoldDocs(docs: GeneratedPages, lang = "en") {
    const unique = `docs-content-${Date.now()}`; // unique dir
    const contentDir = path.join(process.cwd(), unique, lang);

    await fs.ensureDir(contentDir);

    const meta = docs.pages.map((p) => {
        const filename = p.filename.replace(/\.md$/i, ".mdx");
        return {
            title: p.title,
            route: "/" + filename.replace(/\.mdx$/i, ""),
        };
    });

    await fs.writeFile(
        path.join(contentDir, "_meta.js"),
        `export default ${JSON.stringify(meta, null, 2)}`
    );

    for (const page of docs.pages) {
        const filename = page.filename.replace(/\.md$/i, ".mdx");

        console.log(chalk.cyan(`Writing ${filename}...`));

        const frontmatter = `---
        title: ${JSON.stringify(page.title)}
        description: ${JSON.stringify(page.description)}
        filename: ${JSON.stringify(page.filename)}
        ---\n\n`;


        await fs.writeFile(
            path.join(contentDir, filename),
            frontmatter + page.content
        );
    }

    console.log(chalk.green(`\n✅ Wrote ${docs.pages.length} pages → ${unique}/${lang}`));

    return unique;
}
