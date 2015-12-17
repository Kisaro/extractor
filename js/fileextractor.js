var FileExtractor = function() {};
FileExtractor.prototype.name = 'FileExtractor';
FileExtractor.prototype.results = [];
FileExtractor.prototype.files = [];
FileExtractor.prototype.fs = null;
FileExtractor.prototype.fileExtensions = [/.exe$/, /.ink$/, /.mp3$/, /.mkv$/, /.avi$/, /.mp4$/, /.wav$/, /.png$/, /.jpg$/, /.gif$/, /.pdf$/];
FileExtractor.prototype.init = function() {
	FileExtractor.prototype.fs = require('fs');
	var indexStart = Date.now();
	FileExtractor.prototype.indexFiles('/home/kisaro/data/Downloads');
	console.log(FileExtractor.prototype.name + ': ' + FileExtractor.prototype.files.length + ' files indexed in ' + (Date.now() - indexStart)/1000.0 + 's.');
};
FileExtractor.prototype.onkeyup = function(query) {
	FileExtractor.prototype.results = [];
	var resultLimit = 10;
	var subQueries = query.split(' ');
	if(query.length > 0)
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
};
FileExtractor.prototype.onaction = function(query, index) {
	var gui = require('nw.gui');
	gui.Shell.openItem(FileExtractor.prototype.results[index]);
};
FileExtractor.prototype.onsubaction = function(query, index) {
	var gui = require('nw.gui');
	var pathOnly = FileExtractor.prototype.results[index].substr(0, FileExtractor.prototype.results[index].lastIndexOf('/'));
	gui.Shell.openItem(pathOnly);
};
FileExtractor.prototype.indexFiles = function(path) {
	var files = FileExtractor.prototype.fs.readdirSync(path);
	for(var i = 0; i < files.length; i++) {
		var fullpath = path + '/' + files[i];
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