import { TextRenderable, Box, t, fg, CliRenderer } from "@opentui/core";

const LOGO_LINES = [
    '██████╗   ██████╗   ██████╗ ███████╗ ██╗  ██╗ ██╗   ██╗ ██████╗ ',
    '██╔══██╗ ██╔═══██╗ ██╔════╝ ██╔════╝ ██║  ██║ ██║   ██║ ██╔══██╗',
    '██║  ██║ ██║   ██║ ██║      ███████╗ ███████║ ██║   ██║ ██████╔╝',
    '██║  ██║ ██║   ██║ ██║      ╚════██║ ██╔══██║ ██║   ██║ ██╔══██╗',
    '██████╔╝ ╚██████╔╝ ╚██████╗ ███████║ ██║  ██║ ╚██████╔╝ ██████╔╝',
    '╚═════╝   ╚═════╝   ╚═════╝ ╚══════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═════╝ ',
];

// 256-color middle grays - visible on both light and dark backgrounds 
const GRAYS = ['\x1b[38;5;250m',
    '\x1b[38;5;248m',
    '\x1b[38;5;245m',
    '\x1b[38;5;243m',
    '\x1b[38;5;240m',
    '\x1b[38;5;238m',];

export function renderCliHeader(renderer: CliRenderer) {
    const headerBox = Box(
        { flexDirection: "column", paddingTop: 1, paddingBottom: 1 },
        ...LOGO_LINES.map((line, i) => {
            const color: string = GRAYS[i]! ?? GRAYS[0]; // cast to string
            return new TextRenderable(renderer, {
                id: `header-line-${i}`,
                content: t`${fg(color)(line)}`,
            });
        })
    );

    renderer.root.add(headerBox);
}
