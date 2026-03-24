import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("clipvaultDesktop", {
  runtime: "electron"
});
