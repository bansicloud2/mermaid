var Botkit = require('botkit');
var botkitMongoStorage = require('../../storage/mongo');
var Commands = require("../../commands");
var facebookCreateUserMiddleware = require("../middleware/").facebookCreateUser;
var disableBotForUserMiddleware = require("../middleware/").disableBotForUser;

var EVENTS = ['message_received'];
var SERVICE = "facebook";

module.exports = function(app, config) {

    var controller = Botkit.facebookbot({
        storage: botkitMongoStorage(app),
        access_token: config.facebook.PAGE_TOKEN,
        verify_token: config.facebook.VERIFY_TOKEN
    });

    var bot = controller.spawn();

    bot.type = SERVICE;

    controller.type = SERVICE;

    controller.bot = bot;

    controller.config.port = process.env.PORT;
    controller.startTicking();
    controller.createWebhookEndpoints(app, bot);

    controller.middleware.receive.use(facebookCreateUserMiddleware(app));
    controller.middleware.receive.use(disableBotForUserMiddleware(app, SERVICE));

    (new Commands(app, controller)).init(EVENTS);

    app.botkit.facebook = controller;

};
