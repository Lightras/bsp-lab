const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

require('electron-reload')(__dirname);

let win;

function createWindow() {
   // Create the browser window.
   win = new BrowserWindow({
      width: 1300,
      height: 700,
      minWidth: 1190,
      title: 'Фармакоекономічний аналіз технологій етіологічної діагностики вірусних інфекцій',
      webPreferences: {
         devTools: false
      }
   });

   win.removeMenu();

   // win.loadURL(`http://localhost:4200/`);
   // win.loadURL(`file://${__dirname}/dist/ngBuild/index.html`);
   win.loadFile(`./dist/ngBuild/index.html`);

   // uncomment below to open the DevTools.
   win.webContents.openDevTools();

   // Event when the window is closed.
   win.on('closed', () => win = null);
}

// Create window on electron intialization
app.on('ready', createWindow);

app.on('ready', () => {
   autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
   // On macOS specific close process
   if (process.platform !== 'darwin') {
      app.quit();
   }
});

app.on('activate', () => {
   // macOS specific close process
   if (win === null) {
      createWindow();
   }
});


function sendStatusToWindow(text) {
   win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
   sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
   sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
   sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
   sendStatusToWindow('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
   let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
   logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
   logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
   sendStatusToWindow(logMessage);
});
autoUpdater.on('update-downloaded', (info) => {
   sendStatusToWindow('Update downloaded');
});
