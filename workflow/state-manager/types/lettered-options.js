var _ = require("lodash");
var BaseTemplate = require("./base");
var logger = require("../../../logger");
var utils = require("../../../utils");

var LetteredOptionsTemplate = BaseTemplate.extend({

    getPatternCatcher: function(stateManager) {

        var patternCatcher = [];

        for (var n in stateManager.context.uriPayloadHash) {

            var obj = stateManager.context.uriPayloadHash[n];

            var re = new RegExp("^" + obj.payload + "$", "i");

            patternCatcher.push({
                pattern: re,
                callback: function(response, convo) {
                    convo.response = response.text;
                    convo.next();
                }
            });
        }

        patternCatcher.push({
            default: true,
            callback: function(response, convo) {

                convo.stop();

                stateManager.workflowController.route(stateManager.context.uri, {
                    "info": [
                        "Hint: " + stateManager.context['help-text']
                    ]
                });
            }
        });

        return patternCatcher;
    },

    getURIForResponse: function(stateManager, payload) {

        payload = payload.toLowerCase();

        logger.debug("PAYLOAD: %s", payload);

        var key = utils.hashString(payload);

        return stateManager.context.uriPayloadHash[key].uri;
    }
});

module.exports = LetteredOptionsTemplate;
