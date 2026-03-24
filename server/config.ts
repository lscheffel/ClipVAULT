import fs from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  port: number;
  dbPath: string;
  exportDir: string;
  clipboardPollMs: number;
  requestBodyLimitKb: number;
}

const configWarnings: string[] = [];

const parsePositiveInt = (name: string, value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    configWarnings.push(`[config] ${name} inválido (${value}). Usando fallback ${fallback}.`);
    return fallback;
  }

  return parsed;
};

const resolvePath = (name: string, value: string | undefined, fallback: string): string => {
  const raw = value?.trim();
  if (!raw) {
    return path.resolve(process.cwd(), fallback);
  }

  if (raw.length < 2) {
    configWarnings.push(`[config] ${name} inválido (${raw}). Usando fallback ${fallback}.`);
    return path.resolve(process.cwd(), fallback);
  }

  return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
};

export const config: AppConfig = {
  port: parsePositiveInt("PORT", process.env.PORT, 8787),
  dbPath: resolvePath("CLIPVAULT_DB_PATH", process.env.CLIPVAULT_DB_PATH, "clipboard.db"),
  exportDir: resolvePath("CLIPVAULT_EXPORT_DIR", process.env.CLIPVAULT_EXPORT_DIR, "exports"),
  clipboardPollMs: parsePositiveInt("CLIPVAULT_CLIPBOARD_POLL_MS", process.env.CLIPVAULT_CLIPBOARD_POLL_MS, 1000),
  requestBodyLimitKb: parsePositiveInt("CLIPVAULT_BODY_LIMIT_KB", process.env.CLIPVAULT_BODY_LIMIT_KB, 64)
};

export const getConfigWarnings = (): string[] => [...configWarnings];

export const prepareRuntimePaths = async (runtimeConfig: AppConfig = config): Promise<void> => {
  await fs.mkdir(path.dirname(runtimeConfig.dbPath), { recursive: true });
  await fs.mkdir(runtimeConfig.exportDir, { recursive: true });
};
