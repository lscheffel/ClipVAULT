import type { ClipboardUseCaseDeps, ClipboardUseCases } from "./contracts";
import { buildExportPayload, normalizeCopyInput, normalizeLimit, shouldPersistClipboardText } from "./clipboardRules";

export const createClipboardUseCases = (deps: ClipboardUseCaseDeps): ClipboardUseCases => {
  const now = deps.clock ?? (() => new Date());

  return {
    async syncClipboard(lastClipboard: string) {
      const current = await deps.clipboard.readText();

      if (!shouldPersistClipboardText(current, lastClipboard)) {
        return { saved: false, nextLastClipboard: lastClipboard };
      }

      await deps.repository.insert({
        content: current,
        type: "text",
        timestamp: now().toISOString()
      });

      return { saved: true, nextLastClipboard: current };
    },

    async getHistory(limit: number) {
      return deps.repository.listRecent(normalizeLimit(limit, 500));
    },

    async copyItem(input: number | string) {
      const normalized = normalizeCopyInput(input);

      if (normalized.kind === "content") {
        await deps.clipboard.writeText(normalized.content);
        return true;
      }

      const item = await deps.repository.findById(normalized.id);
      if (!item) {
        return false;
      }

      await deps.clipboard.writeText(item.content);
      return true;
    },

    async deleteItem(id: number) {
      return deps.repository.deleteById(id);
    },

    async exportHistory() {
      const items = await deps.repository.listRecent(10000);
      return deps.exporter.exportJson("clipboard_export.json", buildExportPayload(items));
    }
  };
};
