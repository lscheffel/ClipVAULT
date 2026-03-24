import type { ClipboardItem } from "./contracts";

export type CopyInputNormalized = { kind: "id"; id: number } | { kind: "content"; content: string };

export const shouldPersistClipboardText = (current: string, last: string): boolean => {
  return Boolean(current) && current !== last;
};

export const normalizeCopyInput = (input: number | string): CopyInputNormalized => {
  if (typeof input === "number") {
    return { kind: "id", id: input };
  }

  return /^\d+$/.test(input) ? { kind: "id", id: Number(input) } : { kind: "content", content: input };
};

export const normalizeLimit = (value: number | undefined, fallback: number): number => {
  const candidate = typeof value === "number" && value > 0 ? value : fallback;
  return Math.min(candidate, 10000);
};

export const buildExportPayload = (items: ClipboardItem[]): ClipboardItem[] => {
  return items.map((item) => ({ ...item }));
};
