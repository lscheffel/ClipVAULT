import { describe, expect, it, vi } from "vitest";

import { createClipboardUseCases } from "../useCases";
import type { ClipboardGateway, ClipboardItem, ClipboardRepository, ExportGateway } from "../contracts";

const makeItem = (id: number, content: string): ClipboardItem => ({
  id,
  content,
  type: "text",
  timestamp: "2026-03-21T10:00:00.000Z"
});

describe("createClipboardUseCases", () => {
  it("syncClipboard persists new clipboard text and updates last clipboard", async () => {
    const repository: ClipboardRepository = {
      insert: vi.fn(async (item) => makeItem(1, item.content)),
      listRecent: vi.fn(async () => []),
      findById: vi.fn(async () => null),
      deleteById: vi.fn(async () => true)
    };
    const clipboard: ClipboardGateway = {
      readText: vi.fn(async () => "new text"),
      writeText: vi.fn(async () => undefined)
    };
    const exporter: ExportGateway = {
      exportJson: vi.fn(async () => "/tmp/clipboard_export.json")
    };

    const useCases = createClipboardUseCases({ repository, clipboard, exporter });
    const result = await useCases.syncClipboard("old text");

    expect(result).toEqual({ saved: true, nextLastClipboard: "new text" });
    expect(repository.insert).toHaveBeenCalledWith({ content: "new text", type: "text", timestamp: expect.any(String) });
  });

  it("syncClipboard skips persistence when clipboard value is unchanged", async () => {
    const repository: ClipboardRepository = {
      insert: vi.fn(async (item) => makeItem(1, item.content)),
      listRecent: vi.fn(async () => []),
      findById: vi.fn(async () => null),
      deleteById: vi.fn(async () => true)
    };
    const clipboard: ClipboardGateway = {
      readText: vi.fn(async () => "same"),
      writeText: vi.fn(async () => undefined)
    };
    const exporter: ExportGateway = {
      exportJson: vi.fn(async () => "/tmp/clipboard_export.json")
    };

    const useCases = createClipboardUseCases({ repository, clipboard, exporter });
    const result = await useCases.syncClipboard("same");

    expect(result).toEqual({ saved: false, nextLastClipboard: "same" });
    expect(repository.insert).not.toHaveBeenCalled();
  });

  it("copyItem copies by id when found", async () => {
    const repository: ClipboardRepository = {
      insert: vi.fn(async (item) => makeItem(1, item.content)),
      listRecent: vi.fn(async () => []),
      findById: vi.fn(async () => makeItem(5, "db content")),
      deleteById: vi.fn(async () => true)
    };
    const clipboard: ClipboardGateway = {
      readText: vi.fn(async () => ""),
      writeText: vi.fn(async () => undefined)
    };
    const exporter: ExportGateway = {
      exportJson: vi.fn(async () => "/tmp/clipboard_export.json")
    };

    const useCases = createClipboardUseCases({ repository, clipboard, exporter });
    const ok = await useCases.copyItem("5");

    expect(ok).toBe(true);
    expect(clipboard.writeText).toHaveBeenCalledWith("db content");
  });

  it("copyItem returns false when id is not found", async () => {
    const repository: ClipboardRepository = {
      insert: vi.fn(async (item) => makeItem(1, item.content)),
      listRecent: vi.fn(async () => []),
      findById: vi.fn(async () => null),
      deleteById: vi.fn(async () => true)
    };
    const clipboard: ClipboardGateway = {
      readText: vi.fn(async () => ""),
      writeText: vi.fn(async () => undefined)
    };
    const exporter: ExportGateway = {
      exportJson: vi.fn(async () => "/tmp/clipboard_export.json")
    };

    const useCases = createClipboardUseCases({ repository, clipboard, exporter });
    const ok = await useCases.copyItem(999);

    expect(ok).toBe(false);
    expect(clipboard.writeText).not.toHaveBeenCalled();
  });

  it("copyItem copies direct text when input is not numeric", async () => {
    const repository: ClipboardRepository = {
      insert: vi.fn(async (item) => makeItem(1, item.content)),
      listRecent: vi.fn(async () => []),
      findById: vi.fn(async () => null),
      deleteById: vi.fn(async () => true)
    };
    const clipboard: ClipboardGateway = {
      readText: vi.fn(async () => ""),
      writeText: vi.fn(async () => undefined)
    };
    const exporter: ExportGateway = {
      exportJson: vi.fn(async () => "/tmp/clipboard_export.json")
    };

    const useCases = createClipboardUseCases({ repository, clipboard, exporter });
    const ok = await useCases.copyItem("literal");

    expect(ok).toBe(true);
    expect(clipboard.writeText).toHaveBeenCalledWith("literal");
  });

  it("exports recent history with fixed export filename", async () => {
    const repository: ClipboardRepository = {
      insert: vi.fn(async (item) => makeItem(1, item.content)),
      listRecent: vi.fn(async () => [makeItem(2, "x")]),
      findById: vi.fn(async () => null),
      deleteById: vi.fn(async () => true)
    };
    const clipboard: ClipboardGateway = {
      readText: vi.fn(async () => ""),
      writeText: vi.fn(async () => undefined)
    };
    const exporter: ExportGateway = {
      exportJson: vi.fn(async () => "/tmp/clipboard_export.json")
    };

    const useCases = createClipboardUseCases({ repository, clipboard, exporter });
    const outputPath = await useCases.exportHistory();

    expect(repository.listRecent).toHaveBeenCalledWith(10000);
    expect(exporter.exportJson).toHaveBeenCalledWith("clipboard_export.json", [makeItem(2, "x")]);
    expect(outputPath).toBe("/tmp/clipboard_export.json");
  });
});
