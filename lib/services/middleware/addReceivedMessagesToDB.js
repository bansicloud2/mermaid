var _ = require("lodash");
var Utils = require("../../utils");
var logger = require("../../logger");
var Messenger = require("../../messenger");

var addReceivedMessagesToDB = function(app) {

    return function(bot, message, next) {

      console.log(message);

        if (message.user && message.text) {

            var messenger = new Messenger(app, bot, message);
            messenger.recordMessageInDB(message, "received", null);

            next();

        } else {
            next();
        }
    }
};

module.exports = addReceivedMessagesToDB;
