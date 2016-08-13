var Utils = require("../lib/utils");
var logger = require("../lib/logger");
var Messenger = require("../lib/messenger");

var PING = ["ping"];

module.exports = function(app) {

    var commands = [{

        options: PING,

        action: (bot, message) => {

            var service = Utils.getService(bot);
            var userId = Utils.getUserId(service, message.user);
            var code = message.match[0];

            app.service("/v1/users").get(userId).then((user) => {

                var messenger = app.mermaid.getMessengerForUser(user);

                messenger.reply({
                    text: "pong"
                })



            }).catch((e) => {
                logger.error(e);

            });


        }

    }]



    return commands
}
