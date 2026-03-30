const path = require("node:path");
const electron = require("electron");
console.log("electron module:", electron);
console.log("typeof electron:", typeof electron);
if (electron && electron.app) {
  console.log("electron.app exists");
} else {
  console.log("electron.app does NOT exist");
}
const { app, BrowserWindow } = electron;

const isDevelopment = Boolean(process.env.ELECTRON_START_URL);

const createMainWindow = async () => {
  const window = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1080,
    minHeight: 680,
    backgroundColor: "#05070f",
    title: "ClipVault X10",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDevelopment && process.env.ELECTRON_START_URL) {
    await window.loadURL(process.env.ELECTRON_START_URL);
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  await window.loadFile(path.resolve(__dirname, "../dist/index.html"));
};

if (process.env.ELECTRON_SMOKE === "1") {
  // Smoke gate for CI/local without opening full app lifecycle.
  console.log("[electron-smoke] main process loaded");
  process.exit(0);
}

app.whenReady().then(async () => {
  await createMainWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
