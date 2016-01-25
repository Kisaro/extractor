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
		//App.extractors.push(GoogleExtractor);
		for(var i = 0; i < App.extractors.length; i++) {
			App.extractors[i].init();
		}
		App.controls();
		search.focus();
	},
	renderResults: function() {
		var results = document.getElementById('results');
		var renderedResults = '';
		for(var i = 0; i < App.results.length; i++) {
			renderedResults += '<li><h1>' + App.results[i].getTitle() + '</h1><div>' + App.results[i].getDescription() + '</div></li>';
		}
		results.innerHTML = renderedResults;
		if(App.results.length > 0)
			results.getElementsByTagName('li')[App.resultIndex].className = 'selected';

		var baseHeight = 101;
		App.win.setSize(App.win.getSize()[0], baseHeight + App.results.length * 60 + (App.results.length > 1 ? 10 : 0));
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
				}

			}
			//down arrow
			else if(event.keyCode === 40) {
				if(App.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex++].className = '';
					if(App.resultIndex >= App.results.length)
						App.resultIndex = App.results.length-1;
					document.getElementById('results').getElementsByTagName('li')[App.resultIndex].className = 'selected';
				}
			}
			// ESC
			else if(event.keyCode === 27) {
				App.win.hide();
			}
			else {
				App.results = [];
				App.resultIndex = 0;
				for(var i = 0; i < App.extractors.length; i++) {
					App.extractors[i].extract(App.search.value.trim());

					// ----[start] Late resolve results - work in progress ---
					if(!App.extractors[i].busy)
						App.results = App.results.concat(App.extractors[i].results);
					else {
						var index = i;
						var resolveBusyExtractor = function() {
							if(App.extractors[index].busy)
								window.setTimeout(resolveBusyExtractor, 500);
							else {
								App.results = App.results.concat(App.extractors[index].results);
								App.results.sort(function(a,b) {
									return b.getWeight() - a.getWeight();
								});
								App.renderResults();
							}
						};
						window.setTimeout(resolveBusyExtractor, 500);
					}
					// ----[end] Late resolve results -----------------------
				}
				App.results.sort(function(a,b) {
					return b.getWeight() - a.getWeight();
				});
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
	}
};
App.init();
