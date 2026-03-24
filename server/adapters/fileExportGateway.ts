import fs from "node:fs/promises";
import path from "node:path";

import type { ClipboardItem, ExportGateway } from "../../src/core/contracts";

export class FileExportGateway implements ExportGateway {
  public constructor(private readonly exportDir: string) {}

  public async exportJson(filename: string, payload: ClipboardItem[]): Promise<string> {
    await fs.mkdir(this.exportDir, { recursive: true });
    const exportPath = path.resolve(this.exportDir, filename);
    await fs.writeFile(exportPath, JSON.stringify(payload, null, 2), "utf-8");
    return exportPath;
  }
}
