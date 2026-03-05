import clipboard from "clipboardy"

export async function copyToClipboard(text: string): Promise<boolean> {
    // Try OSC52 first (works over SSH, tmux, etc.)
    const encoded = Buffer.from(text).toString("base64")
    process.stdout.write(`\x1b]52;c;${encoded}\x07`)

    // Also try native clipboard as fallback
    try {
        await clipboard.write(text)
        return true
    } catch {
        return false // headless env, CI, etc.
    }
}