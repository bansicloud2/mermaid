var utils = require("../../lib/workflow/state-manager/validator/utils");

var SampleTimeValidator = function(options, baseRoute) {
    this.options = options;
    this.baseRoute = baseRoute;
};

SampleTimeValidator.prototype.validate = function(value, callback) {

    var res = /^(0?[1-9]|1[012])(:[0-5]\d)[APap][mM]$/ig.test(value);

    if (res) {
        return callback && callback();
    } else {

        var custom_message = this.options && this.options.error && this.options.error.message;

        var error = utils.generateError(this.baseRoute, custom_message);

        return callback && callback(error);
    }
}

module.exports = SampleTimeValidator;
