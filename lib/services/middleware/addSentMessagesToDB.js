var _ = require("lodash");
var Utils = require("../../utils");
var logger = require("../../logger");
var Messenger = require("../../messenger");

var addSentMessagesToDB = function(app) {

    return function(bot, message, next) {

        message.user = message.channel;

        var messenger = new Messenger(app, bot, message);
        messenger.recordMessageInDB(message, "sent", null)

        next();


    }
};

module.exports = addSentMessagesToDB;
