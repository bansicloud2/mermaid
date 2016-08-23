/* Simple Wrapper to send and recieve messages */

var _ = require("lodash");
var logger = require("../logger");
var utils = require("../utils");
var InternalMessenger = require("./internal-messenger");
var Q = require("q");

var adapters = {
    "slack": require("./adapters/slack"),
    "facebook": require("./adapters/facebook"),
    "sms": require("./adapters/simple")
};

var Messenger = function(app, bot, message) {
    this.app = app;
    this.bot = bot;
    this.message = message;
    this.service = utils.getService(bot);
    this.internalMessenger = new InternalMessenger(app, bot, message);
    this.userId = utils.getUserId(this.service, message.user);
};

Messenger.prototype.getMessageObject = function(messageObj) {

    var clone = JSON.parse(JSON.stringify(messageObj));

    var Adapter = adapters[this.service];

    var adapter = new Adapter(this.app.config);

    var messageObject = adapter.getMessageObject(clone);

    return messageObject;

};

Messenger.prototype.addConvo = function(convo) {

    this.convo = convo;

};

Messenger.prototype.removeConvo = function() {

    this.convo = null;
};

Messenger.prototype.reply = function(messageObj, context_uri, dontSave) {

    var self = this;

    var messageObject = self.getMessageObject(messageObj);

    if (dontSave) {

        if (self.convo) {

            self.convo.say(messageObject, function(err) {
                if (err) {
                    logger.error(err);
                }
            });

        } else {

            self.bot.reply(self.message, messageObject, function(err) {
                if (err) {
                    logger.error(err);
                }
            })

        }

    } else {

        if (self.convo) {

            self.convo.say(messageObject, function(err) {
                if (err) {
                    logger.error(err);
                }
            });

        } else {

            self.bot.reply(self.message, messageObject, function(err) {
                if (err) {
                    logger.error(err);
                }
            });

        }

    }

};

Messenger.prototype.onStart = function(info, context_uri) {

    var self = this;

    if (info) {

        for (var i = 0, len = info.length; i < len; i++) {

            var messageObj = info[i];

            var messageObject = self.getMessageObject(messageObj)

            self.reply(messageObj, context_uri);
        }
    }

};

Messenger.prototype.ask = function(messageObj, caseHandler, context_uri) {

    var self = this;

    var messageObject = self.getMessageObject(messageObj);

    if (self.convo) {

        self.convo.ask(messageObject, caseHandler, {
            key: "response"
        });

    } else {
        throw new Error("You can't ask without first starting a conversation.");
    }
};

Messenger.prototype.onEnd = function(post_info, end, context_uri) {

    var self = this;

    self.convo.on('end', function(convo) {

        self.removeConvo();

        logger.debug("Ending convo with following response: %s", convo.response);

        if (convo.status === "completed") {

            if (convo.response) {

                if (post_info) {

                    for (var i = 0, len = post_info.length; i < len; i++) {

                        var text = post_info[i];

                        self.reply({
                            text: text
                        }, context_uri);
                    }
                }

                end(convo);

            } else {

                logger.info("Conversation ended.");

                self.reply({
                    text: convo.exit_response || 'Bye'
                }, context_uri);

            }
        }

    });

}

Messenger.prototype.recordMessageInDB = function(messageObj, type, context_uri, cb) {

    var clone = JSON.parse(JSON.stringify(messageObj));

    this.internalMessenger.record(clone, type, context_uri, cb);

};

Messenger.prototype.hiJackThread = function() {

    var deferred = Q.defer();

    this.bot.findConversation(this.message, (convo) => {

        if (convo) {
            convo.stop();
        }

        this.app.service("/v1/users").update(this.userId, {
            "bot_disabled": true
        }).then((user) => {
            deferred.resolve();
        })



    });

    return deferred.promise;
};


module.exports = Messenger;
