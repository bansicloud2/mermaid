var _ = require("lodash");
var ejs = require("ejs");
var logger = require("../../../logger");
var utils = require("../../../utils");
var Q = require("q");

/* Pre-processor for Options */

var OptionsHelper = function(state) {
    this.state = state;
};

OptionsHelper.prototype.getUriPayloadHash = function() {

    var self = this;

    var map = {};

    if (_.isArray(self.state.context["options"])) {

        self.state.context["options"].forEach(function(option, idx) {

            var optionNum = idx + 1;

            option.actions.forEach(function(action) {

                var payload, hash;

                if (action.payload) {

                    payload = ejs.render(action.payload, {
                        "option_num": optionNum
                    });

                    hash = utils.hashString(payload);

                    map[hash] = {
                        payload: payload,
                        uri: ejs.render(action.uri, option)
                    }

                }



            });

        });

    } else {

        for (var i in self.state.context["options"]) {

            var hash = utils.hashString(i);

            map[hash] = {
                payload: i,
                uri: self.state.context["options"][i].uri
            }
        }
    }

    return map;

};

OptionsHelper.prototype.getOptions = function() {

    var self = this;

    var options;

    logger.debug("Preprossed options: %s", JSON.stringify(self.state.context["options"], null, 4));

    if (_.isArray(self.state.context["options"])) {

        options = _.map(self.state.context["options"], function(option, idx) {

            var optionNum = idx + 1;

            option.actions = _.map(option.actions, function(action) {

                if (action.payload) {

                    action.payload = ejs.render(action.payload, {
                        "option_num": optionNum
                    });


                }

                if (action.uri) {

                    action.uri = utils.injectVariables(action.uri, self.state, option);

                }



                return action;

            });

            return option;

        });

    } else {
        options = self.state.context["options"];
    }

    return options;

};

module.exports = OptionsHelper;
