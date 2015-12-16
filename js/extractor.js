var app = {
	extractors: [],
	results: [],
	init: function() {
		var search = document.getElementById('search');
		app.extractors.push(new MathExtractor());
		app.controls(search);
		search.focus();
	},
	renderResults: function() {
		var results = document.getElementById('results');
		var gui = require('nw.gui');
		var win = gui.Window.get();
		var renderedResults = '';
		for(var i = 0; i < app.results.length; i++) {
			renderedResults += '<li>' + app.results[i] + '</li>';
		}
		results.innerHTML = renderedResults;
		win.height = 142 + app.results.length * 80;
	},
	controls: function(search) {
			search.addEventListener('keyup', function(event) {
				// Enter key
				if(event.keyCode === 13) {
					for(var i = 0; i < app.extractors.length; i++) {
						if(event.shiftKey)
							app.extractors[i].onsubaction(search.value);
						else
							app.extractors[i].onaction(search.value);
					}
				} else {
					app.results = [];
					for(var i = 0; i < app.extractors.length; i++) {
						app.extractors[i].onkeyup(search.value);
						app.results = app.results.concat(app.extractors[i].results);
					}
					app.renderResults();
				}
			});
	}
}

app.init();
