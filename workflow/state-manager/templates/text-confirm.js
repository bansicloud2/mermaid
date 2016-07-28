var _ = require("lodash");
var BaseTemplate = require("./base");
var ejs = require("ejs");
var logger = require("../../../../../logger");

var TextConfirmTemplate = BaseTemplate.extend({

    getPatternCatcher: function(stateManager) {

        var patternCatcher = [{
            default: true,
            callback: function(response, convo) {
                if (response.text === stateManager.context["matching-text"]) {
                    convo.response = response.text;
                    convo.next();
                } else {

                    convo.repeat();
                    convo.next();

                }
            }
        }];

        return patternCatcher;
    }


});

module.exports = TextConfirmTemplate;
