var utils = require("../utils");

var ZipCodeValidator = function(options, baseRoute) {
    this.options = options;
    this.baseRoute = baseRoute;
};

ZipCodeValidator.prototype.validate = function(value, callback) {

    var res = /^\d{5}([\-]?\d{4})?$/.test(value);

    if (res) {
        return callback && callback();
    } else {

        var custom_message = this.options && this.options.error && this.options.error.message;

        var error = utils.generateError(this.baseRoute, custom_message);

        return callback && callback(error);
    }
}

module.exports = ZipCodeValidator;
