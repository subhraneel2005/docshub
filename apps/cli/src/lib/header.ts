import { TextRenderable, t, fg, CliRenderer } from "@opentui/core";
import { Box, ASCIIFont, Text, createCliRenderer } from "@opentui/core"

export function renderCliHeader(renderer: CliRenderer) {
    const header = Box(
        {
            width: "100%",
            marginTop: 4,
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 2,
            paddingBottom: 2,
        },
        ASCIIFont({
            text: "DOCSHUB",
            font: "tiny",
            color: "#F7F7F7",
        }),
        Text({
            marginTop: 1,
            content: "CLI tool that generates documentation from github readmes",
            fg: "#EEEEEE",
        })
    )

    renderer.root.add(header);
}