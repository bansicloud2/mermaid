var Botkit = require('botkit');
var mongoStorage = require('../../storage/mongo');
var Commands = require("../../commands");
var facebookCreateUserMiddleware = require("../middleware/").facebookCreateUser;
var disableBotForUserMiddleware = require("../middleware/").disableBotForUser;

var EVENTS = ['message_received'];
var SERVICE = "facebook";

module.exports = function(app, config) {

    var controller = Botkit.facebookbot({
        storage: mongoStorage(app),
        access_token: process.env.FACEBOOK_PAGE_TOKEN,
        verify_token: process.env.FACEBOOK_VERIFY_TOKEN
    });

    var commands = new Commands(app, controller);

    commands.init(EVENTS);

    var bot = controller.spawn();

    bot.type = SERVICE;

    controller.type = SERVICE;

    controller.bot = bot;

    controller.bot.commandsForPatternCatcher = commands.getCommandsForPatternCatcher(bot);

    controller.getBot = function() {
        return bot;
    }

    controller.config.port = process.env.PORT;
    controller.startTicking();
    controller.createWebhookEndpoints(app, bot);

    controller.middleware.receive.use(facebookCreateUserMiddleware(app));
    controller.middleware.receive.use(disableBotForUserMiddleware(app, SERVICE));


    app.mermaid.facebook = controller;

};
