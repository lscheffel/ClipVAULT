import type { AddressInfo } from "node:net";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../app";

describe("API critical routes", () => {
  let server: ReturnType<ReturnType<typeof createApp>["listen"]>;
  let baseUrl = "";

  beforeAll(async () => {
    const app = createApp({ enableClipboardMonitor: false });
    server = app.listen(0);
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  it("returns health status", async () => {
    const data = await fetch(`${baseUrl}/api/health`).then((response) => response.json() as Promise<{ ok: boolean }>);
    expect(data.ok).toBe(true);
  });

  it("returns array for invalid history limit", async () => {
    const data = await fetch(`${baseUrl}/api/history?limit=abc`).then((response) => response.json() as Promise<unknown>);
    expect(Array.isArray(data)).toBe(true);
  });

  it("returns false for invalid copy payload", async () => {
    const data = await fetch(`${baseUrl}/api/copy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then((response) => response.json() as Promise<{ ok: boolean }>);

    expect(data.ok).toBe(false);
  });

  it("returns false for invalid delete id", async () => {
    const data = await fetch(`${baseUrl}/api/history/not-a-number`, { method: "DELETE" }).then(
      (response) => response.json() as Promise<{ ok: boolean }>
    );

    expect(data.ok).toBe(false);
  });

  it("returns export path", async () => {
    const data = await fetch(`${baseUrl}/api/export`, { method: "POST" }).then(
      (response) => response.json() as Promise<{ path: string }>
    );

    expect(typeof data.path).toBe("string");
  });
});
