import {
    BoxRenderable,
    type CliRenderer,
    SelectRenderable,
    SelectRenderableEvents,
} from "@opentui/core";

import { getAllReadmes } from "@repo/core/actions/github/get-all-readme-files";

interface SelectReadmeFilesProps {
    token: string;
    repo: string;
    owner: string;
    renderer: CliRenderer;
    container: BoxRenderable;
}

export async function selectReadmeFiles({
    owner,
    repo,
    token,
    renderer,
    container
}: SelectReadmeFilesProps) {
    const res = await getAllReadmes(token, owner, repo);

    let mdFiles = res.mdFiles;

    const buildOptions = () => [
        ...mdFiles.map((file) => ({
            name: file.isSelected ? `✓ ${file.name}` : file.name,
            description: file.path,
            value: file.path,
        })),
        { name: "✔ Confirm Selection", description: "Proceed to next step", value: "__confirm__" },
    ];

    const menu = new SelectRenderable(renderer, {
        id: "select-md-files",
        width: 54,
        height: 12,
        options: buildOptions(),
        backgroundColor: "transparent",
        focusedBackgroundColor: "transparent",
        selectedBackgroundColor: "#222",
        textColor: "#aaa",
        selectedTextColor: "#fff",
        descriptionColor: "#666",
        showScrollIndicator: false,
    });

    return new Promise<typeof mdFiles>((resolve) => {
        menu.on(SelectRenderableEvents.ITEM_SELECTED, (_, option) => {
            if (option.value === "__confirm__") {
                container.remove(menu.id)
                resolve(mdFiles.filter((f) => f.isSelected));
                return;
            }

            mdFiles = mdFiles.map((file) =>
                file.path === option.value
                    ? { ...file, isSelected: !file.isSelected }
                    : file
            );

            menu.options = buildOptions();
        });

        menu.focus();
        container.add(menu);
    });
}