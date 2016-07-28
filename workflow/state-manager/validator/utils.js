var config = require("../../../../../../config");

var ValidatorUtils = {};

var DEFAULT_ERROR_MESSAGE = config.default_error_message;

ValidatorUtils.generateError = function(baseRoute, custom_message) {

    var routeResetParams = "?overrides[info]=&overrides[prompt]=";

    var message = custom_message || DEFAULT_ERROR_MESSAGE;

    var error = {
        route: baseRoute + routeResetParams + message
    };

    return error;
};

module.exports = ValidatorUtils;
