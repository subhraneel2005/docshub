import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env"), quiet: true });

import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { CONFIG } from "@repo/core/config/env";
import {
  TextRenderable,
  InputRenderable,
  InputRenderableEvents,
  t,
  fg,
  bold,
  dim,
  italic,
  underline,
  CliRenderer,
  Box,
  Text,
} from "@opentui/core";
import { C } from "../constants/colors";
import { setAccessToken, setGeminiApiKey } from "../store/config.store";

export async function login(renderer: CliRenderer) {
  const headerText = new TextRenderable(renderer, {
    id: "header",
    content: t``,
  });

  const statusText = new TextRenderable(renderer, {
    id: "status",
    content: t`${dim("initializing...")}`,
  });

  const infoText = new TextRenderable(renderer, {
    id: "info",
    content: t``,
  });

  const dividerText = new TextRenderable(renderer, {
    id: "divider",
    content: t`${dim("─".repeat(48))}`,
  });

  const geminiLabel = new TextRenderable(renderer, {
    id: "gemini-label",
    content: t``,
  });

  const geminiInput = new InputRenderable(renderer, {
    id: "gemini-input",
    placeholder: "press enter to skip...",
    width: 48,
    backgroundColor: "#0d0d0d",
    focusedBackgroundColor: "#1a1a2e",
    textColor: C.primary,
    cursorColor: C.primary,
    paddingLeft: 1,
    paddingRight: 1,
    showCursor: true,
  });

  const resultText = new TextRenderable(renderer, {
    id: "result",
    content: t``,
  });

  const card = Box(
    {
      id: "login-container",
      width: "100%",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 2,
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
        content: t`${bold(fg(C.primary)("  Docshub Setup  "))}`,
      }),
      dividerText,
      headerText,
      statusText,
      infoText,
      dividerText,
      Text({
        content: t`${dim("optional:")} ${fg(C.secondary)("gemini api key")}`,
      }),
      geminiLabel,
      geminiInput,
      resultText,
    ),
  );

  renderer.root.add(card);
  renderer.start();

  process.on("SIGINT", () => {
    statusText.content = t`${fg(C.error)("✖ cancelled")}`;
    renderer.start();
    renderer.destroy();
  });

  headerText.content = t`${fg(C.secondary)("github authentication")}`;
  renderer.start();

  const auth = createOAuthDeviceAuth({
    clientId: CONFIG.GITHUB_OAUTH_CLIENT_ID,
    scopes: ["repo", "read:user"],
    onVerification: ({ verification_uri, user_code }) => {
      statusText.content = t`${fg(C.warning)("action required")}`;

      infoText.content = t`
${fg(C.secondary)("1.")} ${fg(C.primary)("open in browser:")}
${underline(verification_uri)}

${fg(C.secondary)("2.")} ${fg(C.primary)("enter code:")}
${bold(fg(C.success)(user_code))}
`;
      renderer.start();
    },
  });

  try {
    const result = await auth({ type: "oauth" });

    statusText.content = t`${fg(C.success)("✔ authenticated")}`;
    infoText.content = t`${dim("saving credentials...")}`;
    renderer.start();

    setAccessToken(result.token);

    statusText.content = t`${fg(C.secondary)("optional: gemini api key")}`;
    infoText.content = t`${dim("get yours at: ai.google.dev")}`;
    geminiLabel.content = t`${fg(C.secondary)("press enter to skip")}`;
    geminiInput.focus();
    renderer.start();

    const geminiApiKey = await new Promise<string>((resolveInput) => {
      geminiInput.on(InputRenderableEvents.ENTER, (value: string) => {
        resolveInput(value.trim());
      });
    });

    if (geminiApiKey) {
      setGeminiApiKey(geminiApiKey);
    }

    const geminiStatus = geminiApiKey
      ? fg(C.success)("✔ saved")
      : dim("skipped");

    resultText.content = t`
${fg(C.success)("✓ github")}      ${fg(C.success)("connected")}
${fg(C.secondary)("✓ gemini")}    ${geminiStatus}
${fg(C.secondary)("status:")}    ${fg(C.success)("ready")}
`;
    renderer.start();

    await new Promise((r) => setTimeout(r, 1500));

    renderer.root.remove("login-container");
    renderer.start();

    return result.token;
  } catch (err: any) {
    statusText.content = t`${fg(C.error)("✖ authentication failed")}`;
    infoText.content = t`${dim(err.message || "unknown error")}`;
    renderer.start();
    throw err;
  }
}
