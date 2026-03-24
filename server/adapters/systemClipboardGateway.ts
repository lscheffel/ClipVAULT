import clipboard from "clipboardy";

import type { ClipboardGateway } from "../../src/core/contracts";

export class SystemClipboardGateway implements ClipboardGateway {
  public async readText(): Promise<string> {
    try {
      return await clipboard.read();
    } catch {
      return "";
    }
  }

  public async writeText(value: string): Promise<void> {
    await clipboard.write(value);
  }
}
