var Extractor = function(name) {
  this.name = name+'Extractor';
};
Extractor.prototype = {
  name: 'Extractor',
  results: [],
  init: function() {},
  extract: function(query) {}
};
