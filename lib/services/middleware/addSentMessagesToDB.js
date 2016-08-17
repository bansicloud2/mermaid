var _ = require("lodash");
var Utils = require("../../utils");
var logger = require("../../logger");
var Messenger = require("../../messenger");

var addSentMessagesToDB = function(app) {

    return function(bot, message, next) {

      message.user = message.channel;

      try {

        var messenger = new Messenger(app, bot, message);
        messenger.recordMessageInDB(message, "sent", null);

      } catch(e){
        logger.error(e);
      }



        next();


    }
};

module.exports = addSentMessagesToDB;
