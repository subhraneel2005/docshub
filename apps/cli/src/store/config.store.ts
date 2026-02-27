import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  writeSync,
} from "fs";
import { homedir } from "os";
import { join } from "path";

type Config = {
  accessToken?: string;
  geminiApiKey?: string;
};

const CONF_DIR = join(homedir(), ".docshub");
const CONF_PATH = join(CONF_DIR, "config.json");

function doesConfigFileExist() {
  if (!existsSync(CONF_DIR)) {
    mkdirSync(CONF_DIR, { recursive: true });
  }

  if (!existsSync(CONF_PATH)) {
    writeFileSync(CONF_PATH, JSON.stringify({}, null, 2));
  }
}

function readConfig(): Config {
  doesConfigFileExist();
  const raw = readFileSync(CONF_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeConfig(config: Config) {
  writeFileSync(CONF_PATH, JSON.stringify(config, null, 2));
}

function setAccessToken(token: string) {
  const config = readConfig();
  config.accessToken = token;
  writeConfig(config);
}

function getAccessToken(): string | undefined {
  const config = readConfig();
  return config.accessToken;
}

function setGeminiApiKey(key: string) {
  const config = readConfig();
  config.geminiApiKey = key;
  writeConfig(config);
}

function getGeminiApiKey(): string | undefined {
  const config = readConfig();
  return config.geminiApiKey;
}

function clearAccessToken() {
  const config = readConfig();
  delete config.accessToken;
  writeConfig(config);
}

export {
  setAccessToken,
  getAccessToken,
  setGeminiApiKey,
  getGeminiApiKey,
  clearAccessToken,
};
