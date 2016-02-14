var Extractor = function(name) {
  this.name = name+'Extractor';
};
Extractor.prototype = {
  name: 'Extractor',
  getName: function() {return this.name;},
  results: [],
  getResults: function() {return this.results;},
  init: function() {},
  extract: function(query) {}
};

module.exports = Extractor;
