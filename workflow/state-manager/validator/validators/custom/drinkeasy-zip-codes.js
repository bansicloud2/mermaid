var _ = require("lodash");
var zipcodes = require("zipcodes");
var logger = require("../../../../../../../logger");
var utils = require("../../utils");

var partners = {
    "uber": {
        cities: ["Chicago"]
    },
    "ezras": {
        states: ["AZ", "AR", "CA", "CO", "CT", "DC", "FL", "HI", "ID", "IL", "IA", "KS", "LA", "ME", "MI", "MN", "MO", "NE", "NJ", "NY", "NC", "ND", "OH", "OR", "SC", "SD", "TN", "VA", "WA", "WI", "WY"]
    },
    "andrews": {
        states: ["AZ", "AR", "CA", "CO", "CT", "DC", "FL", "HI", "ID", "IL", "IA", "KS", "LA", "ME", "MI", "MN", "MO", "NE", "NJ", "NY", "NC", "ND", "OH", "OR", "SC", "SD", "TN", "VA", "WA", "WI", "WY"]
    }
}

var test = function(lookup) {

    for (var partner_key in partners) {

        var partner = partners[partner_key];

        for (var location_type in partner) {

            var options = partner[location_type];

            var lookup_key = location_type === "states" ? "state" : "city"; // rough pass

            var lookup_value = lookup[lookup_key];

            if (_.indexOf(options, lookup_value) !== -1) {
                logger.info("Your prefererd vendor is: %s", partner_key);
                return true;
            }

        }
    }

    return false;
}

var DrinkEasyZipCodeValidator = function(options, baseRoute) {
    this.options = options;
		this.baseRoute = baseRoute;
};

DrinkEasyZipCodeValidator.prototype.validate = function(value, callback) {

    var lookup = zipcodes.lookup(value);

    logger.debug("Lookup for DrinkEasyZipCodeValidator: %s", lookup);

    if (!lookup) {

			var error = utils.generateError(this.baseRoute);

			return callback(error);

    } else {

        var res = test(lookup);

        if (res) {
            return callback && callback();
        } else {

            var error = {};

            if (this.options.error_route) {
                error['route'] = this.options.error_route
            }

            return callback && callback(error);
        }
    }
}

module.exports = DrinkEasyZipCodeValidator;
