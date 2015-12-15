var app = {
	extractors: [],
	results: [],
	init: function() {
		var search = document.getElementById('search');
		search.addEventListener('keyup', function() {
			app.results = [];
			for(var i = 0; i < app.extractors.length; i++) {
				app.extractors[i].onkeyup(search.value);
				app.results = app.results.concat(app.extractors[i].results);
			}
			app.renderResults();
		});

		app.extractors.push(new MathExtractor());

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
		win.height = 170 + app.results.length * 40;
	}
}

app.init();