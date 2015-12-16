var MathExtractor = function() {};
MathExtractor.prototype.name = 'MathExtractor';
MathExtractor.prototype.results = [];
MathExtractor.prototype.onkeyup = function(query) {
	MathExtractor.prototype.results = [];
	var result = MathExtractor.prototype.calculate(query);
	if(!Number.isNaN(result)) {
		MathExtractor.prototype.results.push(result);
	}
};
MathExtractor.prototype.onaction = function(query) {
	if(MathExtractor.prototype.results.length > 0) {
		var gui = require('nw.gui');
		var clipboard = gui.Clipboard.get();
		clipboard.set(MathExtractor.prototype.results[0].toString(), 'text');
	}
};
MathExtractor.prototype.onsubaction = function(query) {};

MathExtractor.prototype.calculate = function(input) {
	if(input.match(/^[0-9.*/+-]*\([0-9.*/+()-]+\).*/)) {
		var iStart = input.indexOf('(');
		var iEnd = input.indexOf(')');
		return MathExtractor.prototype.calculate(input.substr(0,iStart) + MathExtractor.prototype.calculate(input.substr(iStart+1, iEnd)) + input.substr(iEnd+1));
	} else if(input.match(/[0-9.*/+-]*sqrt\([0-9.*/+()-]+\).*/)) {
		var iStart = input.indexOf('sqrt(');
		var iEnd = input.indexOf(')');
		return MathExtractor.prototype.calculate(input.substr(0,iStart) + Math.sqrt(MathExtractor.prototype.calculate(input.substr(iStart+5, iEnd))) + input.substr(iEnd+1));
	} else if(input.match(/[0-9.]+\+.*/)) {
		var i = input.indexOf('+');
		return MathExtractor.prototype.calculate(input.substr(0, i)) +
				MathExtractor.prototype.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\-.*/)) {
		var i = input.indexOf('-');
		return MathExtractor.prototype.calculate(input.substr(0, i)) -
				MathExtractor.prototype.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\*.*/)) {
		var i = input.indexOf('*');
		return MathExtractor.prototype.calculate(input.substr(0, i)) *
				MathExtractor.prototype.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\/.*/)) {
		var i = input.indexOf('/');
		return MathExtractor.prototype.calculate(input.substr(0, i)) /
				MathExtractor.prototype.calculate(input.substr(i+1));
	} else {
		return parseFloat(input.trim());
	}
};
