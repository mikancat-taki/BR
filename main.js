const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('renderer/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ブックマーク保存用
ipcMain.handle('save-bookmarks', async (event, bookmarks) => {
  const fs = require('fs');
  fs.writeFileSync(path.join(__dirname, 'data/bookmarks.json'), JSON.stringify(bookmarks, null, 2));
  return true;
});

ipcMain.handle('load-bookmarks', async () => {
  const fs = require('fs');
  const filePath = path.join(__dirname, 'data/bookmarks.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
});
