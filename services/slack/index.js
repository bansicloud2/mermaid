var Botkit = require('botkit');
var config = require("../../../../../config");
var botkitMongoStorage = require('../../storage/mongo');
var DEBUG = process.env.NODE_ENV !== "prod";
var logger = require("../../../../logger");
var Commands = require("../../commands");
var Messenger = require("../../messenger");
var disableBotForUserMiddleware = require("../middleware/").disableBotForUser;
var addSageUserToMessageMiddleware = require("../middleware/").addSageUserToMessage

var SERVICE = "slack";
var EVENTS = ['direct_message', 'direct_mention', 'mention'];

module.exports = function(app) {

    var controller = Botkit.slackbot({
        storage: botkitMongoStorage(app),
        interactive_replies : true
    }).configureSlackApp({
        clientId: config.slack.SLACK_CLIENT_ID,
        clientSecret: config.slack.SLACK_CLIENT_SECRET,
        scopes: ['bot']
    });

    controller.type = SERVICE;

    controller.config.port = process.env.PORT;

    controller.startTicking();
    controller.createWebhookEndpoints(app);
    controller.createOauthEndpoints(app, function(err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });

    controller.middleware.receive.use(disableBotForUserMiddleware(app, SERVICE));

    // just a simple way to make sure we don't
    // connect to the RTM twice for the same team
    controller._bots = {};

    controller.trackBot = function(bot) {
        controller._bots[bot.config.id] = bot;
    };

    controller.getBotByTeamId = function(teamId) {
        return controller._bots[teamId];
    };


    controller.on('create_bot', function(bot, botConfig) {

        bot.type = SERVICE;

        if (controller._bots[bot.config.token]) {
            // already online! do nothing.
        } else {
            bot.startRTM(function(err) {

                if (!err) {
                    controller.trackBot(bot);
                }

                bot.startPrivateConversation({
                    user: botConfig.createdBy
                }, function(err, convo) {
                    if (err) {
                        logger.error(err);
                    } else {

                        var messenger = new Messenger(app, bot, {
                            user: botConfig.createdBy
                        });

                        messenger.addConvo(convo);

                        messenger.reply({
                            text: config.opening_message
                        }, "/");
                    }
                });

            });
        }

    });


    (new Commands(app, controller)).init(EVENTS);

    // Handle events related to the websocket connection to Slack
    controller.on('rtm_open', function(bot) {
        logger.info('** The RTM api just connected!');
    });

    controller.on('rtm_close', function(bot) {
        logger.info('** The RTM api just closed.');
    });

    controller.storage.teams.all(function(err, teams) {

        if (err) {
            throw new Error(err);
        }

        // connect all teams with bots up to slack!
        for (var t in teams) {
            if (teams[t].bot) {

                var botConfig = teams[t];

                var config = {
                    token: botConfig.token,
                    retry: 50,
                    debug: DEBUG,
                    id: botConfig.id
                };

                controller.spawn(config).startRTM(function(err, bot) {
                    if (err) {
                        logger.error('Error connecting bot to Slack:', err);
                    } else {
                        bot.type = SERVICE;
                        controller.trackBot(bot);
                    }
                });
            }
        }

    });

    app.botkit.slack = controller;

}
