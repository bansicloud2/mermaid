var utils = require("../utils");

var EmailValidator = function(options, baseRoute) {
    this.options = options;
    this.baseRoute = baseRoute;
};

EmailValidator.prototype.validate = function(value, callback) {

    var res = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(value);

    if (res) {
        return callback && callback();
    } else {

        var custom_message = this.options && this.options.error && this.options.error.message;

        var error = utils.generateError(this.baseRoute, custom_message);

        return callback && callback(error);
    }
}

module.exports = EmailValidator;
