var FileExtractor = function() {};
FileExtractor.prototype.name = 'FileExtractor';
FileExtractor.prototype.results = [];
FileExtractor.prototype.files = [];
FileExtractor.prototype.fs = null;
FileExtractor.prototype.shell = null;
FileExtractor.prototype.fileExtensions = [/.exe$/, /.lnk$/, /.mp3$/, /.wma$/, /.mkv$/, /.avi$/, /.wmv$/, /.mpg$/, /.mp4$/, /.wav$/, /.png$/, /.jpg$/, /.gif$/, /.pdf$/];
FileExtractor.prototype.init = function() {
	FileExtractor.prototype.fs = require('fs');
	FileExtractor.prototype.shell = require('shell');
	var indexStart = Date.now();
	var config = require('./config');
	for(var i = 0; i < config.indexingPaths.length; i++)
		FileExtractor.prototype.indexFiles(config.indexingPaths[i]);
	console.log(FileExtractor.prototype.name + ': ' + FileExtractor.prototype.files.length + ' files indexed in ' + (Date.now() - indexStart)/1000.0 + 's.');
};
FileExtractor.prototype.onkeyup = function(query) {
	FileExtractor.prototype.results = [];
	var resultLimit = 10;
	var subQueries = query.split(' ');
	if(query.length > 0) {
		if(query.toLowerCase() === 'settings') {
			FileExtractor.prototype.results.push('Settings');
		}
		else
			for(var i = 0; i < FileExtractor.prototype.files.length; i++) {
				var matchAllQueries = true;
				for(var j = 0; j < subQueries.length; j++)
					if(FileExtractor.prototype.files[i].toLowerCase().indexOf(subQueries[j].toLowerCase()) === -1)
						matchAllQueries = false;
				if(FileExtractor.prototype.results.length >= resultLimit)
					break;
				else if(matchAllQueries)
					FileExtractor.prototype.results.push(FileExtractor.prototype.files[i]);
			}
	}
};
FileExtractor.prototype.onaction = function(query, index) {
	var path = require('path');
	if(query.toLowerCase() === 'settings')
		FileExtractor.prototype.shell.showItemInFolder(FileExtractor.prototype.fs.realpathSync('.') + path.sep + 'config.js');
	else if(index > -1 && index < FileExtractor.prototype.results.length)
		FileExtractor.prototype.shell.openItem(FileExtractor.prototype.results[index]);
};
FileExtractor.prototype.onsubaction = function(query, index) {
	if(index > -1 && index < FileExtractor.prototype.results.length)
		FileExtractor.prototype.shell.showItemInFolder(FileExtractor.prototype.results[index]);
};
FileExtractor.prototype.indexFiles = function(path) {
	var p = require('path');
	var files = FileExtractor.prototype.fs.readdirSync(path);
	for(var i = 0; i < files.length; i++) {
		var fullpath = path + p.sep + files[i];
		try {
			FileExtractor.prototype.fs.accessSync(fullpath);
		} catch(ex) {
			continue;
		}
		var stats = FileExtractor.prototype.fs.statSync(fullpath);
		if(stats.isFile())
			for(var j = 0; j < FileExtractor.prototype.fileExtensions.length; j++) {
				if(fullpath.match(FileExtractor.prototype.fileExtensions[j])) {
					FileExtractor.prototype.files.push(fullpath);
					break;
				}
			}
		else if(stats.isDirectory())
			FileExtractor.prototype.indexFiles(fullpath);
	}
};
