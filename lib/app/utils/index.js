var Q = require("q");
var logger = require("../logger");
var Messenger = require("../../messenger");

var utils = {}


utils.createMessageFromData = function(data) {

    var deferred = Q.defer();

    var userId = data.user_id;

    this.service("/v1/users").get(userId).then((user) => {

        var botkit_message_obj = user.last_botkit_message_obj;

        if (user.type === "slack") {

            var teamId = user.platform.team_id;

            var bot = this.mermaid.slack.getBotByTeamId(teamId);



        } else if (user.type === "facebook") {

            var bot = this.mermaid.facebook.bot;

        } else {

            var bot = this.mermaid.sms.bot;

        }

        var messenger = new Messenger(this, bot, botkit_message_obj);

        if (data.meta.hijack) {

            messenger.hiJackThread().then(() => {
                messenger.reply({
                    text: data.text
                }, undefined, true);
            });

        } else {

            messenger.reply({
                text: data.text
            }, undefined, true);

        }

        deferred.resolve();

    }).catch((err) => {
        logger.error("Error trying to retreive user record: %s", err);
        deferred.reject("Error trying to retreive user record");
    });

    return deferred.promise;

}


module.exports = utils;
