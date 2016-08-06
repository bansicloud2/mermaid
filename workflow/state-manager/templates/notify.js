var _ = require("lodash");
var BaseTemplate = require("./base");
var logger = require("../../../logger");
var utils = require("../../../utils");

var NotifyTemplate = BaseTemplate.extend({

    afterHook: function(stateManager) {

        var userId = stateManager.context.user.id;

        var text = "User has requested for assistance: " + stateManager.app.config.bundle.url + "/?userId=" + userId;

        stateManager.app.mermaid.methods.messageTeam(text);
    }

});

module.exports = NotifyTemplate;
