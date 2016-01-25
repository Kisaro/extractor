var Extractor = function(name) {
  this.name = name+'Extractor';
};
Extractor.prototype = {
  name: 'Extractor',
  results: [],
  busy: false,
  init: function() {},
  extract: function(query) {}
};
