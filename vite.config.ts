/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const trimSlash = (value: string): string => value.replace(/\/+$/, "");

const parseApiPort = (rawValue: string | undefined, fallback: number): number => {
  const raw = rawValue?.trim();
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = parseApiPort(env.CLIPVAULT_API_PORT ?? env.PORT, 8787);
  const apiTarget = env.VITE_API_BASE_URL?.trim()
    ? trimSlash(env.VITE_API_BASE_URL)
    : `http://127.0.0.1:${apiPort}`;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true
        }
      }
    },
    test: {
      include: ["src/core/__tests__/**/*.spec.ts", "server/__tests__/**/*.spec.ts"],
      environment: "node",
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/core/**/*.ts"],
        thresholds: {
          lines: 80,
          functions: 80,
          statements: 80
        }
      }
    }
  };
});
