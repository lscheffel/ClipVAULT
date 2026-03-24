import { create } from "zustand";

import { apiClient } from "../lib/apiClient";
import type { ClipboardStore } from "./clipboardStore.types";

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

let pollTimer: ReturnType<typeof setInterval> | null = null;

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  items: [],
  lastClipboardText: "",
  search: "",
  status: "idle",
  errorMessage: null,
  isPolling: false,
  pollIntervalMs: toNumber(import.meta.env.VITE_POLL_INTERVAL_MS, 2000),
  lastSyncAt: null,

  async hydrate(limit = 500) {
    set({ status: "loading", errorMessage: null });

    try {
      const items = await apiClient.getHistory(limit);
      set({ items, status: "ready", lastSyncAt: new Date().toISOString() });
    } catch (error) {
      set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Erro inesperado ao carregar histórico."
      });
    }
  },

  async syncTick() {
    try {
      const sync = await apiClient.syncClipboard();
      const items = await apiClient.getHistory(500);

      set({
        items,
        lastClipboardText: sync.nextLastClipboard,
        status: "ready",
        errorMessage: null,
        lastSyncAt: new Date().toISOString()
      });
    } catch (error) {
      set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Erro inesperado ao sincronizar clipboard."
      });
    }
  },

  startPolling() {
    if (get().isPolling) {
      return;
    }

    set({ isPolling: true });

    void get().syncTick();
    pollTimer = setInterval(() => {
      void get().syncTick();
    }, get().pollIntervalMs);
  },

  stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }

    set({ isPolling: false });
  },

  setSearch(value) {
    set({ search: value });
  },

  async copyItem(input) {
    try {
      return await apiClient.copyItem(input);
    } catch (error) {
      set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Erro inesperado ao copiar item."
      });
      return false;
    }
  },

  async deleteItem(id) {
    try {
      const ok = await apiClient.deleteItem(id);
      if (ok) {
        await get().hydrate();
      }
      return ok;
    } catch (error) {
      set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Erro inesperado ao excluir item."
      });
      return false;
    }
  },

  async exportHistory() {
    try {
      return await apiClient.exportHistory();
    } catch (error) {
      set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Erro inesperado ao exportar."
      });
      return "";
    }
  }
}));
