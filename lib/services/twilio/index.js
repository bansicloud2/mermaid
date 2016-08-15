var twilioSMSBot = require('botkit-sms');
var mongoStorage = require('../../storage/mongo');
var Commands = require("../../commands");
var smsCreateUserMiddleware = require("../middleware/").smsCreateUser;
var disableBotForUserMiddleware = require("../middleware/").disableBotForUser;

var EVENTS = ['message_received'];
var SERVICE = "sms";

module.exports = function(app, config) {

    // Connect to Twilio
    const controller = twilioSMSBot({
        storage: mongoStorage(app),
        account_sid: process.env.TWILIO_ACCOUNT_SID,
        auth_token: process.env.TWILIO_AUTH_TOKEN,
        twilio_number: process.env.TWILIO_NUMBER,
        debug: false
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

    controller.middleware.receive.use(smsCreateUserMiddleware(app));
    controller.middleware.receive.use(disableBotForUserMiddleware(app, SERVICE));

    app.mermaid.sms = controller;

};
