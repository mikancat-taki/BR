const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveBookmarks: (bookmarks) => ipcRenderer.invoke('save-bookmarks', bookmarks),
  loadBookmarks: () => ipcRenderer.invoke('load-bookmarks')
});
