const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const Message = require('../../models/message');
var logger = require("../../logger");
var Messenger = require("../../../messenger");

module.exports = function() {

    const app = this;

    var hijack = function(options) {

        return function(hook) {

            //This request is coming from client

            if (hook.data.meta) {

                var userId = hook.data.user_id;

                app.service("/v1/users").get(userId).then((user) => {

                    var botkit_message_obj = user.last_botkit_message_obj;

                    if (user.type === "slack") {

                        var teamId = user.platform.team_id;

                        var bot = app.mermaid.slack.getBotByTeamId(teamId);

                    } else {
                        var bot = app.mermaid.facebook.bot;
                    }

                    var messenger = new Messenger(app, bot, botkit_message_obj);

                    if (hook.data.meta.hijack) {

                        messenger.hiJackThread().then(() => {
                            messenger.reply({
                                text: hook.data.text
                            }, undefined, true);
                        });

                    } else {

                        messenger.reply({
                            text: hook.data.text
                        }, undefined, true);

                    }

                }).catch((err) => {
                    logger.error("Error trying to retreive user record: %s", err);
                })
            }
        };

    };

    app.use('/v1/messages', service({
        name: 'message',
        Model: Message,
        paginate: {
            default: 50
                // max: 50
        }
    }));

    // Get our initialize service to that we can bind hooks
    const messageService = app.service('/v1/messages');

    // Set up our before hooks
    messageService.before({
        create: [hijack()]
    });
};
