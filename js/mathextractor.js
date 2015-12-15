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

MathExtractor.prototype.calculate = function(input) {
	if(input.match(/[0-9.]+\+.*/)) {
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
