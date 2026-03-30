import { createApp } from "./app";
import { config, getConfigWarnings, prepareRuntimePaths } from "./config";
import { logError, logInfo, logWarn } from "./logger";

const bootstrap = async () => {
  logInfo("bootstrap.start", {
    port: config.port,
    dbPath: config.dbPath,
    exportDir: config.exportDir,
    clipboardPollMs: config.clipboardPollMs
  });

  await prepareRuntimePaths(config);

  for (const warning of getConfigWarnings()) {
    logWarn("config.warning", { message: warning });
  }

  const app = createApp();
  const server = app.listen(config.port, () => {
    logInfo("api.started", { port: config.port });
  });

  server.on("error", (error) => {
    logError("api.listen.failure", {
      port: config.port,
      error: error instanceof Error ? error.message : String(error)
    });
    process.exit(1);
  });
};

bootstrap().catch((error) => {
  logError("bootstrap.failure", { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logError("process.unhandled_rejection", { reason: String(reason) });
});

process.on("uncaughtException", (error) => {
  logError("process.uncaught_exception", { error: error.message });
  process.exit(1);
});
