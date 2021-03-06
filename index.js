const electron = require('electron');
const {app, BrowserWindow, globalShortcut, Tray, Menu} = electron;
const windowWidth = 800;
const windowHeight = 64;

var mainWindow = null;

process.env.GOOGLE_API_KEY = 'AIzaSyCasRAkjoz_jV0M3NHgRlKHlNrpKUOcjM4';
app.commandLine.appendSwitch('enable-speech-dispatcher');

app.on('window-all-closed', function() {
	if(process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	var config = require('./config');
	mainWindow = new BrowserWindow({
    useContentSize: true,
    width: windowWidth,
    height: windowHeight,
    show: config.visibleOnStart,
    resizable: false,
    'always-on-top': true
  });
	var screenDimensions = electron.screen.getPrimaryDisplay().workAreaSize;
	mainWindow.setPosition(parseInt((screenDimensions.width - mainWindow.getContentSize()[0])/2), parseInt(screenDimensions.height/8));
  mainWindow.setMenuBarVisibility(false);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
  globalShortcut.register(config.shortcut, function() {
    if(mainWindow.isVisible())
      mainWindow.hide();
    else
      mainWindow.show();
  });
	mainWindow.setContentSize(windowWidth, windowHeight);
	//mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	var tray = new Tray(electron.nativeImage.createEmpty());
	tray.setToolTip('Extractor');
	tray.setContextMenu(Menu.buildFromTemplate([
		{
			label: 'Open',
			click: function() {
				if(!mainWindow.isVisible())
					mainWindow.show();
			}
		}, {
			label: 'Exit',
			click: function() {
				app.quit();
			}
		}
	]));
});
