import { bold, Box, fg, SelectRenderable, SelectRenderableEvents, t, Text, type CliRenderer } from "@opentui/core";
import { clearScreen } from "..";
import { C, login } from "../commands/login";
import { fetchRepoFlow } from "../commands/generate";

let ghToken = ""
export function renderFeatures(renderer: CliRenderer) {
    const menu = new SelectRenderable(renderer, {
        id: "menu",
        width: 46,
        height: 10,
        options: [
            { name: "Generate Doc", description: "Generate a new docs site", value: "init" },
            { name: "Whoami", description: "Get your details", value: "whoami" },
            { name: "Logout", description: "Logout of your session", value: "logout" },
            { name: "Exit", description: "Exit the application", value: "exit" },
        ],
        backgroundColor: "#000000",
        selectedBackgroundColor: C.secondary,
        selectedTextColor: "#000000",
        textColor: C.secondary,
        descriptionColor: C.secondary,
        alignItems: "flex-start",
        itemSpacing: 1,
        showScrollIndicator: true,
        marginTop: 2
    });

    const container = Box(
        {
            id: "menu-container",
            width: "100%",
            height: "50%",
            justifyContent: "center",
            alignItems: "center",
            gap: 4
        },
        Box(
            {
                width: 50,
                borderStyle: "rounded",
                borderColor: C.secondary,
                padding: 2,
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
            },
            Text({
                content: t`${bold(fg(C.primary)("  Choose an Option  "))}`,
            }),
            Text({
                content: t`${fg(C.secondary)("Use ↑ ↓ to navigate • Enter to select")}`,
            }),
            menu
        )
    );

    menu.on(SelectRenderableEvents.ITEM_SELECTED, async (_index, option) => {
        // clearScreen(renderer);

        if (option.value === "init") {
            renderer.root.remove("menu-container")
            if (!ghToken) {
                ghToken = await login(renderer);
                await fetchRepoFlow(ghToken, renderer);
            }
        }

        if (option.value === "exit") {
            process.exit(0);
        }
    })

    menu.focus()
    renderer.root.add(container)

}