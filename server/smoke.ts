import { createApp } from "./app";
import { config, prepareRuntimePaths } from "./config";

interface SmokeResult {
  endpoint: string;
  ok: boolean;
  details: string;
}

const runSmoke = async (): Promise<SmokeResult[]> => {
  await prepareRuntimePaths(config);
  const app = createApp({ enableClipboardMonitor: false });

  const server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Não foi possível iniciar servidor de smoke.");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;
  const results: SmokeResult[] = [];

  const pushResult = (endpoint: string, ok: boolean, details: string): void => {
    results.push({ endpoint, ok, details });
  };

  try {
    const health = await fetch(`${baseUrl}/api/health`).then((res) => res.json() as Promise<{ ok: boolean }>);
    pushResult("/api/health", health.ok === true, JSON.stringify(health));

    const history = await fetch(`${baseUrl}/api/history?limit=abc`).then((res) => res.json() as Promise<unknown>);
    pushResult("/api/history?limit=abc", Array.isArray(history), `items=${Array.isArray(history) ? history.length : "n/a"}`);

    const copyInvalid = await fetch(`${baseUrl}/api/copy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then((res) => res.json() as Promise<{ ok: boolean }>);
    pushResult("/api/copy (invalid)", copyInvalid.ok === false, JSON.stringify(copyInvalid));

    const deleteInvalid = await fetch(`${baseUrl}/api/history/abc`, { method: "DELETE" }).then(
      (res) => res.json() as Promise<{ ok: boolean }>
    );
    pushResult("/api/history/abc", deleteInvalid.ok === false, JSON.stringify(deleteInvalid));

    const sync = await fetch(`${baseUrl}/api/sync`, { method: "POST" }).then(
      (res) => res.json() as Promise<{ saved: boolean; nextLastClipboard: string }>
    );
    pushResult("/api/sync", typeof sync.saved === "boolean" && typeof sync.nextLastClipboard === "string", JSON.stringify(sync));

    const exported = await fetch(`${baseUrl}/api/export`, { method: "POST" }).then(
      (res) => res.json() as Promise<{ path: string }>
    );
    pushResult("/api/export", typeof exported.path === "string", JSON.stringify(exported));
  } finally {
    server.close();
  }

  return results;
};

const main = async () => {
  const results = await runSmoke();
  let failed = 0;

  for (const result of results) {
    const mark = result.ok ? "PASS" : "FAIL";
    // eslint-disable-next-line no-console
    console.log(`[${mark}] ${result.endpoint} -> ${result.details}`);
    if (!result.ok) {
      failed += 1;
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[smoke] erro inesperado:", error);
  process.exit(1);
});
