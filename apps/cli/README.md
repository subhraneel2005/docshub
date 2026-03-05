# Docshub

A CLI tool that converts GitHub repositories into clean documentation using AI. Select any MD/MDX files from a repo and generate well-structured docs with a single command.

## What it does

Docshub pulls specific MD/MDX files from any GitHub repository, sends them to an AI model, and generates organized documentation ready for your docs site.

## Installation

```bash
# Install globally
npm install -g docshub

# Or run directly
npx docshub
```

## Usage

```bash
docshub
```

The CLI guides you through each step:

1. **Login** — If first time or logged out, authenticate via GitHub device flow (enter the code at github.com/device)
2. **Gemini Key** — Optionally add your own Gemini API key for AI processing (skippable)
3. **Repository** — Enter the org/username (e.g., `subhraneel2005`) and repo name (e.g., `my-repo`)
4. **File Selection** — Browse and select which MD/MDX files to include
5. **Generate** — AI analyzes your files, creates a doc plan, and writes generated content

## Output

Generated docs appear in:

```
~/Desktop/docs-{timestamp}/
```

Each selected file gets AI-generated documentation. The output includes MDX files ready for any docs framework—fumadocs is supported out of the box.

## Creating a Docs Website

The generated output works with [fumadocs](https://fumadocs.dev).

### Option 1: Fresh fumadocs project

```bash
npx create-fumadocs@latest my-docs
cp -r ~/Desktop/docs-{timestamp}/* my-docs/content/
cd my-docs
pnpm dev
```

### Option 2: Add to existing project

```bash
cp -r ~/Desktop/docs-{timestamp}/* your-fumadocs-project/content/
```

## Configuration

- **Token storage**: `~/.docshub/config.json` — contains your GitHub access token
- **Gemini key**: Stored in the same config file (optional)

## Tech Stack

- **Runtime**: Bun
- **CLI UI**: OpenTUI
- **AI**: Gemini 2.5 Flash
- **Output**: MDX

## License

MIT
