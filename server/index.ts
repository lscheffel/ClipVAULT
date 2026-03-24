import { createApp } from "./app";
import { config, getConfigWarnings, prepareRuntimePaths } from "./config";
import { logError, logInfo, logWarn } from "./logger";

const bootstrap = async () => {
  await prepareRuntimePaths(config);

  for (const warning of getConfigWarnings()) {
    logWarn("config.warning", { message: warning });
  }

  const app = createApp();
  app.listen(config.port, () => {
    logInfo("api.started", { port: config.port });
  });
};

bootstrap().catch((error) => {
  logError("bootstrap.failure", { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});
