var utils = require("../../utils");
var firstNames = require("./first_names");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var FirstNameValidator = function(options, baseRoute) {
    this.options = options;
    this.baseRoute = baseRoute;
};

/* Very simple version for a first name detector */

FirstNameValidator.prototype.validate = function(value, callback) {

    var res = firstNames[capitalizeFirstLetter(value.toLowerCase())]

    console.log(value, res)

    if (res) {
        return callback && callback();
    } else {

        var custom_message = this.options && this.options.error && this.options.error.message;

        var error = utils.generateError(this.baseRoute, custom_message);

        return callback && callback(error);
    }
}

module.exports = FirstNameValidator;
