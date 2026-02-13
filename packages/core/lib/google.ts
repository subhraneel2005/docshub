import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CONFIG } from "../config/env";

export const google = createGoogleGenerativeAI({
    apiKey: CONFIG.GOOGLE_GENERATIVE_AI_API_KEY
});