// import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

// const auth = createOAuthDeviceAuth({
//   clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
//   scopes: ["repo", "read:user"],
//   onVerification: ({ verification_uri, user_code }) => {
//     console.log("Open:", verification_uri);
//     console.log("Enter Code:", user_code);
//   },
// });

// const result = await auth({
//   type: "oauth",
// });

// console.log("Token:", result.token);
