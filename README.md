# Docshub

A CLI-first tool that converts GitHub repositories into clean, searchable documentation sites using AI-powered analysis and MDX generation.

## What it does

Docshub takes any GitHub repository and automatically generates a full documentation site from its READMEs and code structure. It uses AI to understand the repository and create well-organized, navigable MDX pages.

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-repo/docshub.git
cd docshub
pnpm install

# Login with GitHub token
docshub login

# Generate docs for a repository
docshub generate
```

You'll be prompted for:

1. GitHub username/organization
2. Repository name

The CLI will fetch all README files, analyze the repository structure, and generate MDX documentation in `~/Desktop/docs-{timestamp}/en`.

## Output

Generated docs include:

- Multiple MDX pages based on repository content
- `_meta.json` for fumadocs navigation
- Clean, editable markdown content

## Creating a Docs Website

The generated output is ready for [fumadocs](https://fumadocs.dev), a modern MDX documentation framework.

### Option 1: Start Fresh

```bash
# Create a new fumadocs project
npx create-fumadocs@latest my-docs

# Copy generated files
cp -r ~/Desktop/docs-{timestamp}/en/* my-docs/content/

# Start dev server
cd my-docs
pnpm dev
```

### Option 2: Add to Existing Project

If you already have a fumadocs project:

1. Copy the generated MDX files to your content folder:

   ```bash
   cp -r ~/Desktop/docs-{timestamp}/en/* your-fumadocs-project/content/
   ```

2. The `_meta.json` file handles navigation structure

3. Edit freely—MDX allows full React components in markdown

### Fumadocs Features

With fumadocs you get:

- Full-text search
- Dark/light theming
- Custom components in MDX
- Versioning support
- Fast static generation

## Project Structure

```
docshub/
├── apps/
│   ├── cli/        # Main CLI application
│   └── web/        # Web interface for browsing docs
└── packages/
    └── core/       # GitHub API, MDX generation, AI integration
```

## Tech Stack

- **Runtime**: Bun
- **CLI UI**: OpenTUI
- **AI**: Gemini 2.5 flash
- **MDX**: Custom generation pipeline
- **Web**: Next.js + Shadcn UI

## License

MIT
