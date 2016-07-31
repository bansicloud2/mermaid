var logger = require("../../../logger");

var Validator = function(validator, baseRoute){

	logger.debug("%s validator initiated with following options: %s", validator.type, validator.options);

	this.type = validator.type;
	this.options = validator.options;
	this.baseRoute = baseRoute;
};

Validator.prototype.validate = function(value, callback){

	var SubValidator = require("./validators/" + this.type);

	var subvalidator = new SubValidator(this.options, this.baseRoute);

	subvalidator.validate(value, function(err, updatedValue){
		return callback && callback(err, updatedValue);
	});

};

module.exports = Validator;
