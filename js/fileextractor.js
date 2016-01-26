var File = function(path){this.path = path};
File.prototype = {
	path: null,
	getFilename: function() {
		var p = require('path');
		var pathparams = this.path.split(p.sep);
		return pathparams[pathparams.length-1];
	},
	getPath: function() {
		return this.path;
	}
};

var FileExtractor = new Extractor('File');
FileExtractor.files = [];
FileExtractor.fs = null;
FileExtractor.shell = null;
FileExtractor.path = null;
FileExtractor.fileExtensions = [];
FileExtractor.init = function() {
	FileExtractor.fs = require('fs');
	FileExtractor.shell = require('shell');
	FileExtractor.path = require('path');
	var indexStart = Date.now();
	var config = require('./config');
	FileExtractor.fileExtensions = config.file.extensions;
	for(var i = 0; i < config.file.paths.length; i++)
		FileExtractor.indexFiles(config.file.paths[i]);
	console.log(FileExtractor.name + ': ' + FileExtractor.files.length + ' files indexed in ' + (Date.now() - indexStart)/1000.0 + 's.');
};
FileExtractor.extract = function(query) {
	FileExtractor.results = [];
	var resultLimit = 15;
	var subQueries = query.split(' ');
	if(query.length > 0) {
		if("settings".indexOf(query.toLowerCase()) >= 0 && query.length > 3) {
			var r = new Result('Settings');
			r.setDescription('Press Enter to access the configuration file of extractor.');
			r.setWeight(90);
			r.action = function() {
				FileExtractor.shell.showItemInFolder(FileExtractor.fs.realpathSync('.') + FileExtractor.path.sep + 'config.js');
			}
			FileExtractor.results.push(r);
		}
		for(var i = 0; i < FileExtractor.files.length; i++) {
			var matchAllQueries = true;
			for(var j = 0; j < subQueries.length; j++)
				if(FileExtractor.files[i].getPath().toLowerCase().indexOf(subQueries[j].toLowerCase()) === -1)
					matchAllQueries = false;
			if(FileExtractor.results.length >= resultLimit)
				break;
			else if(matchAllQueries) {
				var r = new Result(FileExtractor.files[i].getFilename());
				// set weight according to a filenames length, usually important files have brief, pregnant names
				// but make sure we never go below 0 weight
				r.setWeight(100 - Math.min(70, FileExtractor.files[i].getFilename().length));
				r.setDescription(FileExtractor.files[i].getPath());
				r.action = function() {
					FileExtractor.shell.openItem(this.getDescription());
				};
				r.subaction = function() {
					FileExtractor.shell.showItemInFolder(this.getDescription());
				};
				FileExtractor.results.push(r);
			}
		}
	}
};
FileExtractor.indexFiles = function(path) {
	var files = null;
	try {
		files = FileExtractor.fs.readdirSync(path);
	} catch(e) {
		console.warn('FileExtractor: Path not found "' + path + '"');
		return [];
	}
	for(var i = 0; i < files.length; i++) {
		var fullpath = path + FileExtractor.path.sep + files[i];
		try {
			FileExtractor.fs.accessSync(fullpath);
		} catch(ex) {
			continue;
		}
		var stats = FileExtractor.fs.statSync(fullpath);
		if(stats.isFile())
			for(var j = 0; j < FileExtractor.fileExtensions.length; j++) {
				if(fullpath.match(FileExtractor.fileExtensions[j])) {
					FileExtractor.files.push(new File(fullpath));
					break;
				}
			}
		else if(stats.isDirectory())
			FileExtractor.indexFiles(fullpath);
	}
};
