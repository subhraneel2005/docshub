import {
    MarkdownRenderable,
    SyntaxStyle,
    RGBA,
    type CliRenderer,
    type BoxRenderable,
} from "@opentui/core";

interface RenderMarkdownProps {
    renderer: CliRenderer;
    container: BoxRenderable;
    content: string;
    width?: number;
    id: string;
}

export function renderMarkdown({
    renderer,
    container,
    content,
    width = 54,
    id
}: RenderMarkdownProps) {
    const syntaxStyle = SyntaxStyle.fromStyles({
        "markup.heading.1": { fg: RGBA.fromHex("#58A6FF"), bold: true },
        "markup.heading.2": { fg: RGBA.fromHex("#79C0FF"), bold: true },
        "markup.list": { fg: RGBA.fromHex("#FF7B72") },
        "markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
        default: { fg: RGBA.fromHex("#E6EDF3") },
    });

    const markdown = new MarkdownRenderable(renderer, {
        id,
        width,
        content,
        syntaxStyle,
    });

    container.add(markdown);

    return markdown;
}