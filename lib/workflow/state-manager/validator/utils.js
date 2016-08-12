var ValidatorUtils = {};

var DEFAULT_ERROR_MESSAGE = "😕 Seems to have been an issue with your last entry. Can you try again for me?";

ValidatorUtils.generateError = function(baseRoute, custom_message) {

    var routeResetParams = "?overrides[info]=&overrides[prompt]=";

    var message = custom_message || DEFAULT_ERROR_MESSAGE;

    var error = {
        route: baseRoute + routeResetParams + message
    };

    return error;
};

module.exports = ValidatorUtils;
