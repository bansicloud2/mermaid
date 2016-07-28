var utils = require("../../utils");
var logger = require("../../../../logger");
var async = require("async");
var SimpleAdapter = require("../adapters/simple");
var _ = require("lodash");

var InternalMessenger = function(app, bot, message) {

    this.app = app;
    this.message = message;
    this.service = utils.getService(bot);
    this.user_id = utils.getUserId(this.service, message.user);
    this.adapter = new SimpleAdapter();

};

InternalMessenger.prototype.generateMessageData = function(messageObj, type, context_uri) {

    messageObj = this.adapter.getMessageObject(messageObj);

    var message_data = {
        user_id: this.user_id,
        text: messageObj.text,
        type: type,
        context_uri: context_uri,
        timestamp: new Date()
    };

    return message_data;

};

InternalMessenger.prototype.record = function(messageObj, type, context_uri, cb) {

    var self = this;

    if (messageObj.text) {

        var message_data = self.generateMessageData(messageObj, type, context_uri);

        self.app.service("/v1/messages").create(message_data).then(function(message) {

            var updateQuery = {
                last_activity: message.timestamp,
                last_message: message,
                last_botkit_message_obj: self.message,

            };

            if (message.type === "received") {
                _.extend(updateQuery, {
                    $inc: {
                        unread_messages: 1
                    }
                })
            }

            self.app.service("/v1/users").update(self.user_id, updateQuery, {}, function(err, user) {

                if (err) {
                    logger.error(err);
                }

                return cb && cb();

            });

        }).catch(function(err) {
            logger.error(err);
        });

    }
};


module.exports = InternalMessenger;
