"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import fs from "fs";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win = null;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

function registerLocalResourceProtocol() {
  protocol.registerFileProtocol("local-resource", (request, callback) => {
    const url = request.url.replace(/^local-resource:\/\//, "");
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
    try {
      return callback(decodedUrl);
    } catch (error) {
      console.error(
        "ERROR: registerLocalResourceProtocol: Could not get file path:",
        error
      );
    }
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  registerLocalResourceProtocol();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("open-file", (event, args) => {
  if (args === undefined || args === null) {
    dialog
      .showOpenDialog(win, {
        properties: ["openFile"],
        filters: [
          { name: "Portable Document Files", extensions: ["pdf"] },
          { name: "Electronic Publication Files", extensions: ["epub"] },
        ],
      })
      .then((obj) => {
        // File dialog not canceled and file was selected
        if (!obj.canceled && obj.filePaths.length !== 0) {
          event.reply("return-file-path", obj.filePaths[0]);
        }
      });
  }
});

// Load user database for settings
const Datastore = require("nedb"),
  db = new Datastore({
    filename: path.join(
      require("electron").app.getPath("userData"),
      "persistentSettings.db"
    ),
    autoload: true,
  });

console.log(db);

ipcMain.on("load-settings", (event) => {
  db.find({ settings: { $exists: true } }, (err, docs) => {
    if (Array.isArray(docs) && docs.length === 0) {
      console.log("No settings field found. Creating one.");

      const doc = {
        settings: {
          library: {
            path: "",
          },
        },
      };

      db.insert(doc);
      event.reply("load-settings-reply", doc);
    } else {
      db.findOne({ settings: { $exists: true } }, (err, doc) => {
        console.log(doc);
        event.reply("load-settings-reply", doc);
      });
    }
  });
});

ipcMain.on("select-directory", (event) => {
  dialog
    .showOpenDialog(win, {
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled) {
        db.update(
          { settings: { $exists: true } },
          { $set: { "settings.library.path": result.filePaths[0] } },
          {},
          (err, code) => {
            event.reply("select-directory-reply", code);
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("get-library-files", (event, args) => {
  if (args.length !== 0) {
    const root = args + "/library";

    fs.readdir(root, { withFileTypes: true }, (err, files) => {
      let dirList = [];

      files.forEach((file) => {
        if (file.isDirectory()) {
          dirList.push(root + "/" + file.name);
        } else if (file.isFile()) {
          fileList.push(root + "/" + file.name);
        }
      });

      let oldStr = null;
      let newStr = null;

      if (dirList.length !== 0) {
        dirList.forEach((dir) => {
          fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            let fileList = [];

            files.forEach((file) => {
              if (file.isFile()) {
                oldStr = dir + "/" + file.name;
                newStr = oldStr.valueOf();
                fileList.push(newStr);
              }
            });

            event.reply("get-library-files-reply", fileList);
          });
        });
      }
    });
  }
});
