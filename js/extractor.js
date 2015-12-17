var app = {
	extractors: [],
	results: [],
	resultIndex: 0,
	activateShortcut: null,
	init: function() {
		var search = document.getElementById('search');
		app.extractors.push(new MathExtractor());
		app.extractors.push(new FileExtractor());
		for(var i = 0; i < app.extractors.length; i++) {
			app.extractors[i].init();
		}
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
		if(app.results.length > 0)
			results.getElementsByTagName('li')[app.resultIndex].className = 'selected';
		var baseHeight = 103;
		//var baseHeight = 64;
		win.height = baseHeight + app.results.length * 50 + (app.results.length > 1 ? 10 : 0);
	},
	controls: function(search) {
		var gui = require('nw.gui');
		app.activateShortcut = new gui.Shortcut({
			key: "Ctrl+Shift+A",
			active: function() {
				console.log('yay');
				//require('nw.gui').Window.get().minimize();
			},
			failed: function(msg) {
				console.error(msg);
			}
		});
		try {
			gui.App.unregisterGlobalHotKey(app.activateShortcut);
		} finally {
			gui.App.registerGlobalHotKey(app.activateShortcut);
		}
		search.addEventListener('keyup', function(event) {
			// Enter key
			if(event.keyCode === 13) {
				for(var i = 0; i < app.extractors.length; i++) {
					if(event.shiftKey)
						app.extractors[i].onsubaction(search.value, app.resultIndex);
					else
						app.extractors[i].onaction(search.value, app.resultIndex);
				} 
			}
			// up arrow
			else if(event.keyCode === 38) {
				event.preventDefault();
				if(app.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[app.resultIndex--].className = '';
					if(app.resultIndex < 0)
						app.resultIndex = 0;
					document.getElementById('results').getElementsByTagName('li')[app.resultIndex].className = 'selected';
				}
				
			}
			//down arrow
			else if(event.keyCode === 40) {
				event.preventDefault();
				if(app.results.length > 0) {
					document.getElementById('results').getElementsByTagName('li')[app.resultIndex++].className = '';
					if(app.resultIndex >= app.results.length)
						app.resultIndex = app.results.length-1;
					document.getElementById('results').getElementsByTagName('li')[app.resultIndex].className = 'selected';
				}
			}
			// ESC
			else if(event.keyCode === 27) {
				event.preventDefault();
				gui.Window.get().minimize();
			}
			else {
				app.results = [];
				app.resultIndex = 0;
				for(var i = 0; i < app.extractors.length; i++) {
					app.extractors[i].onkeyup(search.value.trim());
					app.results = app.results.concat(app.extractors[i].results);
				}
				app.renderResults();
			}
		});
	}
}

app.init();
