var Result = function(title){this.title = title};
Result.prototype = {
  title: null,
  setTitle: function(title) {this.title = title;},
  getTitle: function() {return this.title},
  description: '',
  setDescription: function(description) {this.description = description},
  getDescription: function() {return this.description},
  weight: 0,
  setWeight: function(weight) {this.weight = weight;},
  getWeight: function() {return this.weight},
  action: function() {console.warn('No action defined for result "' + this.title + '"');},
  subaction: function() {console.warn('No subaction defined for result "' + this.title + '"');},
  minimizeOnAction: false,
  minimizeOnSubaction: false
};
