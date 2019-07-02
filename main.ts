const { app, BrowserWindow } = require('electron');
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
   // win.loadURL(`file://${__dirname}/dist/index.html`);
   win.loadFile(`./dist/index.html`);

   // uncomment below to open the DevTools.
   // win.webContents.openDevTools()

   // Event when the window is closed.
   win.on('closed', () => win = null);
}

// Create window on electron intialization
app.on('ready', createWindow);

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
