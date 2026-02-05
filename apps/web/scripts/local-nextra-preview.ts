import { generateDocs } from "@/lib/docs-generator/generate-docs";
import fs from "fs/promises";
import path from "path";

async function ensureNextraRoute() {
    const routeDir = path.join(
        process.cwd(),
        "app",
        "docs",
        "[[...mdxPath]]"
    );

    const pageFile = path.join(routeDir, "page.tsx");

    try {
        await fs.access(pageFile);
        console.log("nextra route already exists");
    } catch {
        await fs.mkdir(routeDir, { recursive: true });

        const content = `import { importPage, generateStaticParamsFor } from "nextra/pages";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export default async function Page({ params }: { params: { mdxPath?: string[] } }) {
  const { default: Component, toc, metadata } = await importPage(params.mdxPath);
  return <Component toc={toc} metadata={metadata} />;
}
`;

        await fs.writeFile(pageFile, content);
        console.log("created nextra catch-all route");
    }
}

async function run() {
    await ensureNextraRoute();

    const readme = await fs.readFile("README.md", "utf8");
    const result = await generateDocs(readme);

    const base = path.join(process.cwd(), "content", "docs");

    await fs.rm(base, { recursive: true, force: true });
    await fs.mkdir(base, { recursive: true });

    const indexContent = `---
title: Documentation
---

# Documentation

Welcome to the auto-generated documentation.

${result.pages.length > 0 ? '## Pages\n\nExplore the sections in the sidebar.' : ''}
`;

    await fs.writeFile(path.join(base, "index.mdx"), indexContent);

    // write pages
    for (const p of result.pages) {
        const dir = p.parent ? path.join(base, p.parent) : base;

        await fs.mkdir(dir, { recursive: true });

        await fs.writeFile(
            path.join(dir, `${p.slug}.mdx`),
            p.content
        );
    }

    // CHANGE THIS SECTION - Add index to root meta
    const rootMeta = {
        index: "Home",
        ...result.meta.root
    };

    const rootMetaContent = `export default ${JSON.stringify(rootMeta, null, 2)}
`;

    await fs.writeFile(
        path.join(base, "_meta.js"),
        rootMetaContent
    );

    // nested meta files (unchanged)
    for (const [folder, meta] of Object.entries(result.meta.nested)) {
        const nestedDir = path.join(base, folder);
        await fs.mkdir(nestedDir, { recursive: true });

        const nestedMetaContent = `export default ${JSON.stringify(meta, null, 2)}
`;

        await fs.writeFile(
            path.join(nestedDir, "_meta.js"),
            nestedMetaContent
        );
    }

    console.log("✅ Nextra docs generated successfully!");
    console.log(`📁 Output: ${base}`);
    console.log(`📄 Pages: ${result.pages.length}`);
    console.log(`📂 Root meta keys: ${Object.keys(result.meta.root).length}`);
    console.log(`📂 Nested folders: ${Object.keys(result.meta.nested).length}`);
}

run().catch(console.error);
run().catch(console.error);