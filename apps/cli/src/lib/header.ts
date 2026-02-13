const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
// 256-color grays - visible on both light and dark backgrounds
const DIM = '\x1b[38;5;102m'; // darker gray for secondary text
const TEXT = '\x1b[38;5;145m'; // lighter gray for primary text

const LOGO_LINES = [
    '██████╗   ██████╗   ██████╗ ███████╗ ██╗  ██╗ ██╗   ██╗ ██████╗ ',
    '██╔══██╗ ██╔═══██╗ ██╔════╝ ██╔════╝ ██║  ██║ ██║   ██║ ██╔══██╗',
    '██║  ██║ ██║   ██║ ██║      ███████╗ ███████║ ██║   ██║ ██████╔╝',
    '██║  ██║ ██║   ██║ ██║      ╚════██║ ██╔══██║ ██║   ██║ ██╔══██╗',
    '██████╔╝ ╚██████╔╝ ╚██████╗ ███████║ ██║  ██║ ╚██████╔╝ ██████╔╝',
    '╚═════╝   ╚═════╝   ╚═════╝ ╚══════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═════╝ ',
];


// 256-color middle grays - visible on both light and dark backgrounds
const GRAYS = [
    '\x1b[38;5;250m', // lighter gray
    '\x1b[38;5;248m',
    '\x1b[38;5;245m', // mid gray
    '\x1b[38;5;243m',
    '\x1b[38;5;240m',
    '\x1b[38;5;238m', // darker gray
];

export function renderCliHeader() {
    console.log();
    LOGO_LINES.forEach((line, i) => {
        console.log(`${GRAYS[i]}${line}${RESET}`);
    });

}
