const { app, BrowserWindow, webContents, globalShortcut } = require('electron');
const path = require('path');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

var mainWindow = {};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  globalShortcut.register('F5', () => {
    mainWindow.webContents.openDevTools();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const { Menu } = require('electron')

const menu_template = [
  // File, Edit, View, Window, Help
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click: async() => {
          const { app } = require('electron')
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Manage Game Directories',
        click: async() => {
          mainWindow.loadFile(path.join(__dirname, 'settings.html'));
        }
      }
    ]
  }
]

Menu.setApplicationMenu(Menu.buildFromTemplate(menu_template))