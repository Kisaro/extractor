var MathExtractor = new Extractor('Math');
MathExtractor.clipboard = null;
MathExtractor.init = function() {
	MathExtractor.clipboard = require('electron').clipboard;
};
MathExtractor.extract = function(query) {
	MathExtractor.results = [];
	var result = MathExtractor.calculate(query);
	if(!Number.isNaN(result) && result != query) {
		var r = new Result(result);
		r.setDescription('Press Enter to copy the result to clipboard');
		if(result !== query)
			r.setWeight(100);
		r.action = function() {
			MathExtractor.clipboard.writeText(this.getTitle().toString());
		}
		r.minimizeOnAction = true;
		MathExtractor.results.push(r);
	}
};

MathExtractor.calculate = function(input) {
	if(input.match(/[0-9.*/+-]*sqrt\([0-9.*/+()-]+?\).*/)) {
		var subCalculation = input.replace(/^(.*)sqrt\(([0-9.*/+-]+?)\)(.*)$/g, '$2');
		var iStart = input.indexOf(subCalculation)-5;
		var iEnd = input.indexOf(subCalculation) + subCalculation.length;
		return MathExtractor.calculate(input.substr(0,iStart) + Math.sqrt(MathExtractor.calculate(subCalculation)) + input.substr(iEnd+1));
	} else if(input.match(/^[0-9.*/+-]*\([0-9.*/+()-]+?\).*/)) {
		var subCalculation = input.replace(/^(.*)\(([0-9.*/+-]+?)\)(.*)$/g, '$2');
		var iStart = input.indexOf(subCalculation)-1;
		var iEnd = input.indexOf(subCalculation) + subCalculation.length;
		return MathExtractor.calculate(input.substr(0,iStart) + MathExtractor.calculate(subCalculation) + input.substr(iEnd+1));
	} else if(input.match(/[0-9.]+\+.*/)) {
		var i = input.indexOf('+');
		return MathExtractor.calculate(input.substr(0, i)) +
				MathExtractor.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\-.*/)) {
		var i = input.indexOf('-');
		return MathExtractor.calculate(input.substr(0, i)) -
				MathExtractor.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\*.*/)) {
		var i = input.indexOf('*');
		return MathExtractor.calculate(input.substr(0, i)) *
				MathExtractor.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\/.*/)) {
		var i = input.indexOf('/');
		return MathExtractor.calculate(input.substr(0, i)) /
				MathExtractor.calculate(input.substr(i+1));
	} else if(input.match(/[0-9.]+\^.*/)) {
		var i = input.indexOf('^');
		return Math.pow(MathExtractor.calculate(input.substr(0,i)), MathExtractor.calculate(input.substr(i+1)));
	} else {
		if(input.match(/[^0-9.]/))
			return Number.NaN;
		else
			return parseFloat(input.trim());
	}
};

module.exports = MathExtractor;
