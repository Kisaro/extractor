var Result = require('./js/result');
var Extractor = require('./js/extractor');
var App = {
	extractors: [],
	results: [],
	win: null,
	resultIndex: 0,
	search: null,
	baseHeight: 64,
	searchByVoice: false,
	init: function() {
		App.win = require('electron').remote.getCurrentWindow();
		App.search = document.getElementById('search');

		// autoload all modules that are an instance of Extractor and initialize them
		var fs = require('fs');
		var files = [];
		try {
			files = fs.readdirSync(__dirname + '/js');
		} catch(e) {
			console.error('Cannot access /js directory');
		}

		for(var i = 0; i < files.length; i++)
			if(files[i].match(/[A-Z]+extractor.js$/i)) {
				var ext = require('./js/'+files[i])
				if(ext instanceof Extractor) {
					ext.init();
					App.extractors.push(ext);
					console.log(ext.getName() + ' loaded.');
				} else {
					console.warn('Skipped invalid extractor: '+files[i]);
				}
			}

		App.controls();
		App.voiceControls();
		search.focus();
	},
	renderResults: function() {
		var results = document.getElementById('results');
		var renderedResults = '';
		// Make sure to get _all_ results
		App.results = [];
		App.resultIndex = 0;
		for(var i = 0; i < App.extractors.length; i++)
			App.results = App.results.concat(App.extractors[i].results);

		// sort results according to their weight
		App.results.sort(function(a,b) {
			return b.getWeight() - a.getWeight();
		});

		// finally, render the results
		for(var i = 0; i < App.results.length; i++) {
			renderedResults += '<li><h1>' + App.results[i].getTitle() + '</h1><div>' + App.results[i].getDescription() + '</div></li>';
		}
		results.innerHTML = renderedResults;
		if(App.results.length > 0)
			results.getElementsByTagName('li')[App.resultIndex].className = 'selected';

		var newHeight = App.baseHeight + App.results.length * 80 + (App.results.length > 1 ? 10 : 0);
		App.win.setContentSize(App.win.getContentSize()[0], (newHeight > App.baseHeight + 810 ? App.baseHeight + 810 : newHeight));
	},
	controls: function() {
		App.search.addEventListener('keyup', function(event) {
			App.searchByVoice = false;
			// Enter key
			if(event.keyCode === 13 && App.results.length > 0) {
					if(event.shiftKey) {
						if(App.results[App.resultIndex].minimizeOnSubaction)
							App.win.hide();
						App.results[App.resultIndex].subaction();
					} else {
						if(App.results[App.resultIndex].minimizeOnAction)
							App.win.hide();
						App.results[App.resultIndex].action();
					}
					App.search.select();
			}
			// up arrow
			else if(event.keyCode === 38) {
				if(App.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex--].className = '';
					if(App.resultIndex < 0)
						App.resultIndex = 0;
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
					if(App.results.length > 10)
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex-Math.min(9, App.resultIndex)].scrollIntoView({behaviour: 'smooth', block: 'end'});
				}

			}
			//down arrow
			else if(event.keyCode === 40) {
				if(App.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex++].className = '';
					if(App.resultIndex >= App.results.length)
						App.resultIndex = App.results.length-1;
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
					if(App.resultIndex > 8)
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex-9].scrollIntoView({behaviour: 'smooth', block: 'end'});
				}
			}
			// ESC
			else if(event.keyCode === 27) {
				App.win.hide();
			}
			else {
				for(var i = 0; i < App.extractors.length; i++) {
					App.extractors[i].extract(App.search.value.trim());
				}
				App.renderResults();
			}
		});
		// Prevent cursor from moving when pressing up/down arrow
		search.addEventListener("keydown", function(e) {
	  	if (e.keyCode === 38 || e.keyCode === 40) {
				e.preventDefault();
				return false;
			}
		}, false);
	},
	triggerSearchEvent: function() {
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("keyup", false, true);
			App.search.dispatchEvent(evt);
		}
		else
			App.search.fireEvent("onkeydown");
	},
	speak: function(text) {
		var config = require('./config.js');
		if(config.voiceResponse && speechSynthesis) {
			var message = new SpeechSynthesisUtterance(text);
			message.voice = speechSynthesis.getVoices()[0];
			speechSynthesis.speak(message);
		}
	},
	voiceControls: function() {
		var config = require('./config.js');
		if(config.voiceControl && annyang) {
			var hotWord = config.hotWord + ' *query';
			var commands = {};
			commands[hotWord] = function(query) {
				if(!App.win.isVisible())
					App.win.show();
				App.search.value = query;
				App.triggerSearchEvent();
				App.searchByVoice = true;
			};
			commands['down'] = function() {
				if(App.results.length > 0 && App.win.isVisible()) {
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex++].className = '';
					if(App.resultIndex >= App.results.length)
						App.resultIndex = App.results.length-1;
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
					if(App.resultIndex > 8)
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex-9].scrollIntoView({behaviour: 'smooth', block: 'end'});
				}
			};
			commands['up'] = function() {
				if(App.results.length > 0 && App.win.isVisible()) {
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex--].className = '';
					if(App.resultIndex < 0)
						App.resultIndex = 0;
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
					if(App.results.length > 10)
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex-Math.min(9, App.resultIndex)].scrollIntoView({behaviour: 'smooth', block: 'end'});
				}
			};
			commands['ok'] = function() {
				if(App.search.value.length > 0 && App.results.length > 0 && App.win.isVisible()) {
					if(App.results[App.resultIndex].minimizeOnAction)
						App.win.hide();
					App.results[App.resultIndex].action();
					App.search.select();
				}
			};
			annyang.addCommands(commands);
			annyang.setLanguage('en-US');
			annyang.start({continuous: false});
		} else {
			console.warn('Could not initialize voice controls');
		}
	}
};
App.init();
