const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var globalShortcut = require('global-shortcut');
var mainWindow = null;

app.on('window-all-closed', function() {
	if(process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
    width: 800,
    height: 101,
    show: true,
    resizable: false,
    'always-on-top': true
  });
  mainWindow.setMenuBarVisibility(false);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
  var config = require('./config');
  globalShortcut.register(config.shortcut, function() {
    if(mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  });
	//mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
