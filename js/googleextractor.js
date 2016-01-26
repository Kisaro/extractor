var GoogleExtractor = new Extractor('Google');
GoogleExtractor.apiKey = null;
GoogleExtractor.apiUrl = 'https://kgsearch.googleapis.com/v1/entities:search?query=';
GoogleExtractor.request = null;
GoogleExtractor.lastTimestamp = null;
GoogleExtractor.cooldown = 800;
GoogleExtractor.maxResults = 5;
GoogleExtractor.timer = null;
GoogleExtractor.recentQuery = '';
GoogleExtractor.init = function() {
  GoogleExtractor.request = require('request');
  GoogleExtractor.lastTimestamp = Date.now();
	var config = require('./config');
  GoogleExtractor.apiKey = config.google.apiKey;
}

GoogleExtractor.extract = function(query) {
  GoogleExtractor.results = [];
  GoogleExtractor.lastTimestamp = Date.now();
  if(query.length > 3){
    if(GoogleExtractor.timer !== null)
      clearTimeout(GoogleExtractor.timer);
    GoogleExtractor.lookup(query);
    GoogleExtractor.recentQuery = query;
  }
}

GoogleExtractor.lookup = function(query) {
    if(GoogleExtractor.lastTimestamp + GoogleExtractor.cooldown < Date.now() && GoogleExtractor.recentQuery == query) {

      GoogleExtractor.request(GoogleExtractor.apiUrl + encodeURI(query.trim().toLowerCase() + '&key=' + GoogleExtractor.apiKey), function(error, response, body) {
        var items = JSON.parse(body).itemListElement;
        GoogleExtractor.results = [];
        for(var i = 0; i < Math.min(items.length, GoogleExtractor.maxResults); i++) {
          var r = new Result(items[i].result.name);
          if(items[i].result.detailedDescription === undefined)
            r.setDescription(items[i].result.description);
          else
            r.setDescription(items[i].result.detailedDescription.articleBody);
          r.setWeight(items[i].resultScore/10);
          GoogleExtractor.results.push(r);
        }
        // These results will come in late, so we have to rerender once we're done
        App.renderResults();
      });

    }
    else
      GoogleExtractor.timer = window.setTimeout(function() {
        GoogleExtractor.lookup(query);
      }, GoogleExtractor.cooldown+1);
}
