var config = {
	visibleOnStart: true,
	shortcut: 'Alt+Space',
	voiceControl: true,
	file: {
		extensions: [/.exe$/, /.lnk$/, /.mp3$/, /.wma$/, /.mkv$/, /.avi$/, /.wmv$/, /.mpg$/, /.mp4$/, /.wav$/, /.png$/, /.jpg$/, /.gif$/, /.pdf$/, /.html$/, /.js$/, /.css$/, /.php$/],
		paths: [
		  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
		  'E:\\Video',
		  'E:\\Music',
		  'E:\\Picture'
		]
	},
	google: {
		apiKey: 'AIzaSyCasRAkjoz_jV0M3NHgRlKHlNrpKUOcjM4' // Consider getting your own knowledgegraph api key for more quota
	}
}

module.exports = config;
