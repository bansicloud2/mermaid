var GoogleMapsAPI = require("googlemaps");
var utils = require("../utils");
var _ = require("lodash");
var logger = require("../../../../../../logger")

var publicConfig = {
    key: 'AIzaSyAly023I7kW2qTJYo94rK14gfIizV_C0QQ',
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true, // use https
};

var googleAddressComponentParser = function(components) {

    var output = {
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    };

    for (var c in output) {

        switch (c) {
            case "address":
                output[c] = _.reduce(components, function(r, component) {
                    if (component.types[0] === "street_number") {
                        return r + component.long_name + " ";
                    } else if (component.types[0] === "route") {
                        return r + component.short_name;
                    }

                    return r;

                }, "");
                break;
            case "city":
                output[c] = _.reduce(components, function(r, component) {

                    if (component.types[0] === "locality") {
                        return r + component.long_name;
                    }

                    return r;
                }, "");
                break;
            case "state":
                output[c] = _.reduce(components, function(r, component) {

                    if (component.types[0] === "administrative_area_level_1") {
                        return r + component.short_name;
                    }

                    return r;
                }, "");
                break;
            case "zip":
                output[c] = _.reduce(components, function(r, component) {

                    if (component.types[0] === "postal_code") {
                        return r + component.short_name;
                    }

                    return r;
                }, "");

                break;

            case "country":
                output[c] = _.reduce(components, function(r, component) {
                    if (component.types[0] === "country") {
                        return r + component.short_name;
                    }

                    return r;
                }, "");
                break;

            default:
                break;
        }



    }

    return output;

};

var gmAPI = new GoogleMapsAPI(publicConfig);

var AddressValidator = function(options, baseRoute) {
    this.options = options;
    this.baseRoute = baseRoute;
};

AddressValidator.prototype.validate = function(value, callback) {

    var geocodeParams = {
        "address": value,
        "language": "en"
    };

    gmAPI.geocode(geocodeParams, function(err, result) {

        if (err) {

            logger.error("Error retreiving geodata from Google API: %s", err);

            var error = utils.generateError(this.baseRoute, "Something went wrong. Please try again.")

            return callback && callback(error);

        }

        if (result.results.length === 0) {

            var error = utils.generateError(this.baseRoute, "We found no results for the address you typed in. Please specify the address again.")

            return callback && callback(error);

        }

        if (result.results.length > 1) {

            var error = utils.generateError(this.baseRoute, "We found more than one result for the address you typed in. Please specify the address more granularly.")

            return callback && callback(error);

        }

        if (result.results.length === 1) {

            var updatedValue = googleAddressComponentParser(result.results[0].address_components);

            return callback && callback(null, updatedValue);
        }

    }.bind(this));
}

module.exports = AddressValidator;
