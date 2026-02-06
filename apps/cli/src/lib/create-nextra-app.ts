// packages/core/src/lib/create-nextra-app.ts

import path from "path";
import fs from "fs-extra";
import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";

export async function createNextNextraApp(targetDir: string) {
  const spinner = ora(chalk.hex("#5FCD01")("creating nextjs app...")).start();

  /* ---------------- create next app ---------------- */
  await execa(
    "pnpm",
    [
      "dlx",
      "create-next-app@latest",
      ".",
      "--ts",
      "--eslint",
      "--app",
      "--tailwind",
      "--use-pnpm",
      "--yes"
    ],
    { cwd: targetDir, stdio: "inherit" }
  );

  spinner.text = chalk.hex("#5FCD01")("installing nextra...");

  /* ---------------- install nextra ---------------- */
  await execa(
    "pnpm",
    ["add", "nextra", "nextra-theme-docs"],
    { cwd: targetDir, stdio: "inherit" }
  );

  /* ---------------- write next.config.mjs ---------------- */
  await fs.writeFile(
    path.join(targetDir, "next.config.mjs"),
    `import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs"
});

export default withNextra({});
`
  );

  /* ---------------- create app folders ---------------- */
  const appDir = path.join(targetDir, "app");
  const catchAllDir = path.join(appDir, "[[...mdxPath]]");

  await fs.ensureDir(appDir);
  await fs.ensureDir(catchAllDir);

  /* ---------------- layout.jsx ---------------- */
  await fs.writeFile(
    path.join(appDir, "layout.jsx"),
    `import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {};

const navbar = <Navbar logo={<b>Docs</b>} />;
const footer = <Footer>MIT {new Date().getFullYear()} © Docs.</Footer>;

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
`
  );

  /* ---------------- catch-all mdx page ---------------- */
  await fs.writeFile(
    path.join(catchAllDir, "page.jsx"),
    `export { generateStaticParams, generateMetadata } from "nextra/pages";
export { default } from "nextra/pages";
`
  );

  /* ---------------- content dir ---------------- */
  await fs.ensureDir(path.join(targetDir, "content", "en"));

  /* ---------------- gitignore update ---------------- */
  await fs.appendFile(
    path.join(targetDir, ".gitignore"),
    `\ncontent/**/*.generated.mdx\n`
  );

  spinner.succeed(chalk.hex("#5FCD01")("nextra docs app created"));
}
