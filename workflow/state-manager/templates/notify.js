var _ = require("lodash");
var config = require("../../../../../../config");
var BaseTemplate = require("./base");
var logger = require("../../../../../logger");
var utils = require("../../../utils");

var NotifyTemplate = BaseTemplate.extend({

    afterHook: function(stateManager, response) {

        var prompt = stateManager.context["prompt"];
        var userId = stateManager.context.user.id;

        var text = 'When prompted: "' + prompt + "\".\n" +
            "User responded with : \"" + response + "\".\n" +
            "Please go to the dashboard and help resolve: " + config.bundle.url + "/?userId=" + userId;

        utils.emailTeam(text);
    }

});

module.exports = NotifyTemplate;
