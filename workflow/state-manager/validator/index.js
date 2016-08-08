var logger = require("../../../logger");

var Validator = function(app, validator, baseRoute){

	logger.debug("%s validator initiated with following options: %s", validator.type, validator.options);

	this.app = app;
	this.type = validator.type;
	this.options = validator.options;
	this.baseRoute = baseRoute;
};

Validator.prototype.validate = function(value, callback){

	var SubValidator = this.app.mermaid.validators[this.type];

	var subvalidator = new SubValidator(this.options, this.baseRoute);

	subvalidator.validate(value, function(err, updatedValue){
		return callback && callback(err, updatedValue);
	});

};

module.exports = Validator;
