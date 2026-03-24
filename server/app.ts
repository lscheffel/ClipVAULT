import { randomUUID } from "node:crypto";

import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import { createClipboardUseCases } from "../src/core/useCases";
import { FileExportGateway } from "./adapters/fileExportGateway";
import { SqliteClipboardRepository } from "./adapters/sqliteClipboardRepository";
import { SystemClipboardGateway } from "./adapters/systemClipboardGateway";
import { config } from "./config";
import { logError, logInfo, logWarn } from "./logger";

const DEFAULT_HISTORY_LIMIT = 500;
const MAX_HISTORY_LIMIT = 10000;
const MAX_COPY_CONTENT_LENGTH = 20000;

const isCopyInput = (value: unknown): value is number | string => {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    return value.length <= MAX_COPY_CONTENT_LENGTH;
  }

  return false;
};

const parseId = (raw: string): number | null => {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
};

export interface CreateAppOptions {
  enableClipboardMonitor?: boolean;
}

const parseHistoryLimit = (input: unknown): number => {
  const raw = Array.isArray(input) ? input[0] : input;
  const parsed = Number(raw ?? DEFAULT_HISTORY_LIMIT);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_HISTORY_LIMIT;
  }
  return Math.min(parsed, MAX_HISTORY_LIMIT);
};

const getRequestId = (response: Response): string => {
  return String(response.locals.requestId ?? "n/a");
};

export const createApp = (options: CreateAppOptions = {}) => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: `${config.requestBodyLimitKb}kb` }));

  app.use((request, response, next) => {
    const requestId = randomUUID();
    const startedAt = Date.now();

    response.locals.requestId = requestId;
    logInfo("http.request", {
      requestId,
      method: request.method,
      path: request.path
    });

    response.on("finish", () => {
      logInfo("http.response", {
        requestId,
        method: request.method,
        path: request.path,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt
      });
    });

    next();
  });

  const repository = new SqliteClipboardRepository(config.dbPath);
  const clipboard = new SystemClipboardGateway();
  const exporter = new FileExportGateway(config.exportDir);
  const useCases = createClipboardUseCases({ repository, clipboard, exporter });

  let lastClipboard = "";

  const syncClipboard = async () => {
    try {
      const result = await useCases.syncClipboard(lastClipboard);
      lastClipboard = result.nextLastClipboard;
      return result;
    } catch (error) {
      logError("clipboard.sync.failure", { error: error instanceof Error ? error.message : String(error) });
      return { saved: false, nextLastClipboard: lastClipboard };
    }
  };

  const enableClipboardMonitor = options.enableClipboardMonitor ?? true;
  if (enableClipboardMonitor) {
    void syncClipboard();
    const monitorTimer = setInterval(() => {
      void syncClipboard();
    }, config.clipboardPollMs);
    monitorTimer.unref();
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/history", async (req, res) => {
    try {
      const limit = parseHistoryLimit(req.query.limit);
      const items = await useCases.getHistory(limit);
      res.json(items);
    } catch (error) {
      logError("api.history.failure", {
        requestId: getRequestId(res),
        error: error instanceof Error ? error.message : String(error)
      });
      res.json([]);
    }
  });

  app.post("/api/sync", async (_req, res) => {
    try {
      const result = await syncClipboard();
      res.json(result);
    } catch (error) {
      logError("api.sync.failure", {
        requestId: getRequestId(res),
        error: error instanceof Error ? error.message : String(error)
      });
      res.json({ saved: false, nextLastClipboard: lastClipboard });
    }
  });

  app.post("/api/copy", async (req, res) => {
    try {
      const payload = req.body as { input?: unknown } | undefined;
      const input = payload?.input;

      if (!isCopyInput(input)) {
        logWarn("api.copy.invalid_payload", {
          requestId: getRequestId(res),
          reason: "input must be number|string with safe length"
        });
        res.json({ ok: false });
        return;
      }

      const ok = await useCases.copyItem(input);
      res.json({ ok });
    } catch (error) {
      logError("api.copy.failure", {
        requestId: getRequestId(res),
        error: error instanceof Error ? error.message : String(error)
      });
      res.json({ ok: false });
    }
  });

  app.delete("/api/history/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        logWarn("api.history.delete.invalid_id", {
          requestId: getRequestId(res),
          id: req.params.id
        });
        res.json({ ok: false });
        return;
      }

      const ok = await useCases.deleteItem(id);
      res.json({ ok });
    } catch (error) {
      logError("api.history.delete.failure", {
        requestId: getRequestId(res),
        error: error instanceof Error ? error.message : String(error)
      });
      res.json({ ok: false });
    }
  });

  app.post("/api/export", async (_req, res) => {
    try {
      const path = await useCases.exportHistory();
      res.json({ path });
    } catch (error) {
      logError("api.export.failure", {
        requestId: getRequestId(res),
        error: error instanceof Error ? error.message : String(error)
      });
      res.json({ path: "" });
    }
  });

  app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    if (response.headersSent) {
      next(error);
      return;
    }

    logError("api.unhandled_error", {
      requestId: getRequestId(response),
      method: request.method,
      path: request.path,
      error: error instanceof Error ? error.message : String(error)
    });

    if (request.path === "/api/history" && request.method === "GET") {
      response.json([]);
      return;
    }

    if (request.path === "/api/export" && request.method === "POST") {
      response.json({ path: "" });
      return;
    }

    response.json({ ok: false });
  });

  return app;
};
