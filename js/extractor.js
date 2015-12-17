var Extractor = {
	extractors: [],
	results: [],
	win: null,
	resultIndex: 0,
	init: function() {
		Extractor.win = require('remote').getCurrentWindow();
		var search = document.getElementById('search');
		Extractor.extractors.push(new MathExtractor());
		Extractor.extractors.push(new FileExtractor());
		for(var i = 0; i < Extractor.extractors.length; i++) {
			Extractor.extractors[i].init();
		}
		Extractor.controls(search);
		search.focus();
	},
	renderResults: function() {
		var results = document.getElementById('results');
		var renderedResults = '';
		for(var i = 0; i < Extractor.results.length; i++) {
			renderedResults += '<li>' + Extractor.results[i] + '</li>';
		}
		results.innerHTML = renderedResults;
		if(Extractor.results.length > 0)
			results.getElementsByTagName('li')[Extractor.resultIndex].className = 'selected';

		var baseHeight = 101;
		Extractor.win.setSize(Extractor.win.getSize()[0], baseHeight + Extractor.results.length * 50 + (Extractor.results.length > 1 ? 10 : 0));
	},
	controls: function(search) {
		search.addEventListener('keyup', function(event) {
			// Enter key
			if(event.keyCode === 13) {
				for(var i = 0; i < Extractor.extractors.length; i++) {
					if(event.shiftKey)
						Extractor.extractors[i].onsubaction(search.value, Extractor.resultIndex);
					else
						Extractor.extractors[i].onaction(search.value, Extractor.resultIndex);
				}
			}
			// up arrow
			else if(event.keyCode === 38) {
				event.preventDefault();
				if(Extractor.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[Extractor.resultIndex--].className = '';
					if(Extractor.resultIndex < 0)
						Extractor.resultIndex = 0;
					document.getElementById('results').getElementsByTagName('li')[Extractor.resultIndex].className = 'selected';
				}

			}
			//down arrow
			else if(event.keyCode === 40) {
				event.preventDefault();
				if(Extractor.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[Extractor.resultIndex++].className = '';
					if(Extractor.resultIndex >= Extractor.results.length)
						Extractor.resultIndex = Extractor.results.length-1;
					document.getElementById('results').getElementsByTagName('li')[Extractor.resultIndex].className = 'selected';
				}
			}
			// ESC
			else if(event.keyCode === 27) {
				event.preventDefault();
				Extractor.win.hide();
			}
			else {
				Extractor.results = [];
				Extractor.resultIndex = 0;
				for(var i = 0; i < Extractor.extractors.length; i++) {
					Extractor.extractors[i].onkeyup(search.value.trim());
					Extractor.results = Extractor.results.concat(Extractor.extractors[i].results);
				}
				Extractor.renderResults();
			}
		});
	}
};
Extractor.init();
