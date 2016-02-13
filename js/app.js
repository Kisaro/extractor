var App = {
	extractors: [],
	results: [],
	win: null,
	resultIndex: 0,
	search: null,
	baseHeight: 0,
	init: function() {
		App.win = require('remote').getCurrentWindow();
		App.baseHeight = App.win.getSize()[1];
		App.search = document.getElementById('search');
		App.extractors.push(MathExtractor);
		App.extractors.push(FileExtractor);
		for(var i = 0; i < App.extractors.length; i++) {
			App.extractors[i].init();
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
		App.win.setSize(App.win.getSize()[0], (newHeight > App.baseHeight + 810 ? App.baseHeight + 810 : newHeight));
	},
	controls: function() {
		App.search.addEventListener('keyup', function(event) {
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
			annyang.start();
		} else {
			console.warn('Could not initialize voice controls');
		}
	}
};
App.init();
