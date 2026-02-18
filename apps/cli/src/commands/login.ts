import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env"), quiet: true });

import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { CONFIG } from "@repo/core/config/env";
import {
    createCliRenderer,
    TextRenderable,
    BoxRenderable,
    t, fg, bold, underline,
    CliRenderer,
    Box,
    Text,
} from "@opentui/core";

export const C = {
    primary: "#F7F7F7",
    secondary: "#EEEEEE",
    success: "#08CB00",
    error: "#FF1E00",
};

export async function login(renderer: CliRenderer) {
    const statusText = new TextRenderable(renderer, {
        id: "status",
        content: t`${fg(C.secondary)("starting github device auth...")}`,
    });

    const infoText = new TextRenderable(renderer, {
        id: "info",
        content: t``,
    });

    const finalText = new TextRenderable(renderer, {
        id: "final",
        content: t``,
    });

    const card = Box(
        {
            width: "100%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 3,
        },
        Box(
            {
                flexDirection: "column",
                alignItems: "center",
                borderStyle: "rounded",
                borderColor: C.secondary,
                padding: 2,
                gap: 1,
            },
            Text({
                content: t`${bold(fg(C.primary)("  GitHub Authentication  "))}`,
            }),
            statusText,
            infoText,
            finalText,
        )
    );

    renderer.root.add(card);
    renderer.start();

    process.on("SIGINT", () => {
        statusText.content = t`${fg(C.error)("✖ cancelled by user")}`;
        renderer.start();
        process.exit(0);
    });

    const auth = createOAuthDeviceAuth({
        clientId: CONFIG.GITHUB_OAUTH_CLIENT_ID,
        scopes: ["repo", "read:user"],
        onVerification: ({ verification_uri, user_code }) => {
            statusText.content = t`${fg(C.success)(bold("github login required"))}`;

            infoText.content = t`${fg(C.secondary)("open: ")}${fg(C.primary)(underline(verification_uri))}
${fg(C.secondary)("code: ")}${fg(C.primary)(bold(user_code))}`;

            statusText.content = t`${fg(C.secondary)("waiting for authentication...")}`;
            renderer.start();
        },
    });

    try {
        const result = await auth({ type: "oauth" });

        statusText.content = t`${fg(C.success)(bold("✔ authentication complete"))}`;

        finalText.content = t`
${fg(C.success)("✔ github connected")}
${fg(C.secondary)("status:")} ${fg(C.primary)("ready")}
`;
        renderer.start();

        return result.token;
    } catch (err: any) {
        statusText.content = t`${fg(C.error)("✖ authentication failed")}`;
        renderer.start();
        throw err;
    }
}