import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env"), quiet: true });

import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { CONFIG } from "@repo/core/config/env";
import { createCliRenderer, TextRenderable, t, fg, bold, underline, CliRenderer } from "@opentui/core";

export async function login(renderer: CliRenderer) {

    const statusText = new TextRenderable(renderer, {
        id: "status",
        content: t`${fg("#00FFFF")("starting github device auth...")}`, // cyan
    });
    renderer.root.add(statusText);

    process.on("SIGINT", () => {
        statusText.content = t`${fg("#FF0000")("✖ cancelled by user")}`; // red
        renderer.start();
        process.exit(0);
    });

    const auth = createOAuthDeviceAuth({
        clientId: CONFIG.GITHUB_OAUTH_CLIENT_ID,
        scopes: ["repo", "read:user"],
        onVerification: ({ verification_uri, user_code }) => {
            statusText.content = t`${fg("#00FF00")(bold("github login required"))}`; // green
            renderer.start();

            const infoBox = new TextRenderable(renderer, {
                id: "info",
                content: t`${fg("#888888")("open: ")}${underline(verification_uri)}
${fg("#888888")("code: ")}${fg("#FFFF00")(user_code)}`, // yellow code
            });
            renderer.root.add(infoBox);

            statusText.content = t`${fg("#00FFFF")("waiting for authentication...")}`;
            renderer.start();
        },
    });

    try {
        const result = await auth({ type: "oauth" });

        statusText.content = t`${fg("#00FF00")("✔ authentication complete")}`;
        renderer.start();

        const finalStatus = new TextRenderable(renderer, {
            id: "final",
            content: t`
${fg("#00FF00")("✔ github connected")}
${fg("#888888")("status:")} ready
`,
        });
        renderer.root.add(finalStatus);
        renderer.start();

        return result.token;
    } catch (err: any) {
        statusText.content = t`${fg("#FF0000")("authentication failed")}`;
        renderer.start();
        throw err;
    }
}
