var config = {
	visibleOnStart: true,
	shortcut: 'Alt+Space',
	voiceControl: true,
	voiceResponse: false,
	hotWord: 'hey',
	file: {
		extensions: [/.exe$/i, /.lnk$/i, /.mp3$/i, /.wma$/i, /.mkv$/i, /.avi$/i, /.wmv$/i, /.mpg$/i, /.mp4$/i, /.wav$/i, /.png$/i, /.jpg$/i, /.gif$/i, /.pdf$/i, /.html$/i, /.js$/i, /.css$/i, /.php$/i],
		paths: [
		  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
		  'E:\\Video',
		  'E:\\Music',
		  'E:\\Picture',
		  'E:\\Downloads',
		  'E:\\Dropbox'
		]
	}
}

module.exports = config;
