import { describe, expect, it } from "vitest";

import { buildExportPayload, normalizeCopyInput, normalizeLimit, shouldPersistClipboardText } from "../clipboardRules";
import type { ClipboardItem } from "../contracts";

describe("clipboardRules", () => {
  it("persist only when text is non-empty and changed", () => {
    expect(shouldPersistClipboardText("", "old")).toBe(false);
    expect(shouldPersistClipboardText("same", "same")).toBe(false);
    expect(shouldPersistClipboardText("new", "old")).toBe(true);
  });

  it("normalizes copy input to id when number or numeric string", () => {
    expect(normalizeCopyInput(12)).toEqual({ kind: "id", id: 12 });
    expect(normalizeCopyInput("0012")).toEqual({ kind: "id", id: 12 });
    expect(normalizeCopyInput("abc")).toEqual({ kind: "content", content: "abc" });
  });

  it("normalizes history limits with cap and fallback", () => {
    expect(normalizeLimit(undefined, 500)).toBe(500);
    expect(normalizeLimit(0, 500)).toBe(500);
    expect(normalizeLimit(50, 500)).toBe(50);
    expect(normalizeLimit(15000, 500)).toBe(10000);
  });

  it("builds export payload preserving contract fields", () => {
    const items: ClipboardItem[] = [
      { id: 1, content: "A", type: "text", timestamp: "2026-03-21T10:00:00.000Z" }
    ];

    expect(buildExportPayload(items)).toEqual(items);
  });
});
