export type LogLevel = "INFO" | "WARN" | "ERROR";

type LogMeta = Record<string, unknown>;

const emit = (level: LogLevel, event: string, meta: LogMeta = {}): void => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...meta
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
};

export const logInfo = (event: string, meta?: LogMeta): void => emit("INFO", event, meta);
export const logWarn = (event: string, meta?: LogMeta): void => emit("WARN", event, meta);
export const logError = (event: string, meta?: LogMeta): void => emit("ERROR", event, meta);
