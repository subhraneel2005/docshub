import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CONFIG } from "../config/env";
import { getGeminiApiKey } from "../config/config";

const userApiKey = getGeminiApiKey();

export const google = createGoogleGenerativeAI({
  apiKey: userApiKey || CONFIG.GOOGLE_GENERATIVE_AI_API_KEY,
});
