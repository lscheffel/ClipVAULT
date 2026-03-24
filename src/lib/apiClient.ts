import type { ClipboardItem } from "../core/contracts";

const trimSlash = (value: string): string => value.replace(/\/+$/, "");

const buildApiBaseCandidates = (): string[] => {
  const candidates: string[] = [];
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configured) {
    candidates.push(trimSlash(configured));
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    if (protocol === "http:" || protocol === "https:") {
      candidates.push(trimSlash(window.location.origin));
    }
  }

  candidates.push("http://localhost:8787");
  return [...new Set(candidates)];
};

const apiBaseCandidates = buildApiBaseCandidates();

const fetchApi = async (path: string, init?: RequestInit): Promise<Response> => {
  for (let index = 0; index < apiBaseCandidates.length; index += 1) {
    const base = apiBaseCandidates[index];
    const url = `${base}${path}`;

    try {
      const response = await fetch(url, init);

      if (response.status === 404 && index < apiBaseCandidates.length - 1) {
        continue;
      }

      return response;
    } catch {
      // tenta a próxima base candidata
    }
  }

  throw new Error(
    `Nao foi possivel conectar a API. Verifique se o backend esta ativo (npm run dev ou npm run dev:api). Bases tentadas: ${apiBaseCandidates.join(", ")}.`
  );
};

const readJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  async getHistory(limit = 500): Promise<ClipboardItem[]> {
    const response = await fetchApi(`/api/history?limit=${limit}`);
    return readJson<ClipboardItem[]>(response);
  },

  async syncClipboard(): Promise<{ saved: boolean; nextLastClipboard: string }> {
    const response = await fetchApi("/api/sync", { method: "POST" });
    return readJson<{ saved: boolean; nextLastClipboard: string }>(response);
  },

  async copyItem(input: number | string): Promise<boolean> {
    const response = await fetchApi("/api/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    const data = await readJson<{ ok: boolean }>(response);
    return data.ok;
  },

  async deleteItem(id: number): Promise<boolean> {
    const response = await fetchApi(`/api/history/${id}`, { method: "DELETE" });
    const data = await readJson<{ ok: boolean }>(response);
    return data.ok;
  },

  async exportHistory(): Promise<string> {
    const response = await fetchApi("/api/export", { method: "POST" });
    const data = await readJson<{ path: string }>(response);
    return data.path;
  }
};
