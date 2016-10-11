var WeatherExtractor = new Extractor('Weather');
WeatherExtractor.apiUrl = 'https://www.metaweather.com/api/';
WeatherExtractor.locationName = null;
WeatherExtractor.degrees = null;
WeatherExtractor.image = null;

WeatherExtractor.init = function() {
	this.request = require('request');
	WeatherExtractor.getLocation();
	window.setInterval(WeatherExtractor.getLocation, 30 * 60 * 1000);
};

WeatherExtractor.extract = function(query) {
	WeatherExtractor.results = [];
	if(query.toLowerCase() === 'weather' || query.toLowerCase() === 'wetter') {
		if(this.degrees === null) {
			var result = new Result('Error while trying to find your current position');
			result.setDescription('Please try again later');
			result.setWeight(100);
			this.results.push(result);
			App.renderResults();
		} else {
			var result = new Result(this.degrees + '°C in ' + this.locationName);
			result.setDescription('<img width="32" height="32" src="https://www.metaweather.com/static/img/weather/png/64/' + this.image + '.png">');
			result.setWeight(100);
			this.results = [];
			this.results.push(result);
			App.renderResults();
		}
	}
};

WeatherExtractor.getLocation = function() {
	navigator.geolocation.getCurrentPosition(
		function(location) {
			WeatherExtractor.getWeatherByLocation(location);
		}, function(error) {
			console.error(error);
		});
}

WeatherExtractor.getWeatherByLocation = function(location) {
	return this.request(this.apiUrl + 'location/search?lattlong=' + location.coords.latitude + ',' + location.coords.longitude, function(error, response, body) {
		var result = JSON.parse(body);
		WeatherExtractor.locationName = result[0].title;
		WeatherExtractor.getWeatherByWoeId(result[0].woeid);
	});
};

WeatherExtractor.getWeatherByWoeId = function(woeId) {
	this.request(this.apiUrl + 'location/' + woeId + '/', function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			var weatherData = data.consolidated_weather[0];
			console.log(weatherData);
			WeatherExtractor.degrees = Number(weatherData.the_temp).toFixed(1);
			WeatherExtractor.image = weatherData.weather_state_abbr;
		}
	});
}

module.exports = WeatherExtractor;