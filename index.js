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
	var config = require('./config');
	mainWindow = new BrowserWindow({
    width: 800,
    height: 44,
    show: config.visibleOnStart,
    useContentSize: true,
    resizable: false,
    'always-on-top': true
  });
	var screenDimensions = electron.screen.getPrimaryDisplay().workAreaSize;
	mainWindow.setPosition(parseInt((screenDimensions.width - mainWindow.getSize()[0])/2), parseInt(screenDimensions.height/8));
  mainWindow.setMenuBarVisibility(false);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
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
