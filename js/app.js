var App = {
	extractors: [],
	results: [],
	win: null,
	resultIndex: 0,
	search: null,
	init: function() {
		App.win = require('remote').getCurrentWindow();
		App.search = document.getElementById('search');
		App.extractors.push(MathExtractor);
		App.extractors.push(FileExtractor);
		App.extractors.push(GoogleExtractor);
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

		var baseHeight = 101;
		var newHeight = baseHeight + App.results.length * 80 + (App.results.length > 1 ? 10 : 0);
		App.win.setSize(App.win.getSize()[0], (newHeight > baseHeight + 810 ? baseHeight + 810 : newHeight));
	},
	controls: function() {
		App.search.addEventListener('keyup', function(event) {
			// Enter key
			if(event.keyCode === 13) {
					if(event.shiftKey)
						App.results[App.resultIndex].subaction();
					else
						App.results[App.resultIndex].action();

					App.win.hide();
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
	voiceControls: function() {
		var config = require('./config.js');
		if(config.voiceControl && annyang) {
			annyang.addCommands({
				'hey *query': function(query) {
					if(!App.win.isVisible())
						App.win.show();
						App.search.value = query;
						if ("createEvent" in document) {
					    var evt = document.createEvent("HTMLEvents");
					    evt.initEvent("keyup", false, true);
					    App.search.dispatchEvent(evt);
						}
						else
							App.search.fireEvent("onkeydown");
				},
				'down': function() {
					if(App.results.length > 0) {
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex++].className = '';
						if(App.resultIndex >= App.results.length)
							App.resultIndex = App.results.length-1;
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
						if(App.resultIndex > 8)
							document.getElementById('results').getElementsByTagName('li')[App.resultIndex-9].scrollIntoView({behaviour: 'smooth', block: 'end'});
					}
				},
				'up': function() {
					if(App.results.length > 0) {
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex--].className = '';
						if(App.resultIndex < 0)
							App.resultIndex = 0;
						document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
						if(App.results.length > 10)
							document.getElementById('results').getElementsByTagName('li')[App.resultIndex-Math.min(9, App.resultIndex)].scrollIntoView({behaviour: 'smooth', block: 'end'});
					}
				},
				'ok': function() {
					if(App.search.value.length > 0 && App.results.length > 0) {
						App.results[App.resultIndex].action();
						App.win.hide();
					}
				}
			});
			annyang.start();
		} else {
			console.warn('Could not initialize voice controls');
		}
	}
};
App.init();
