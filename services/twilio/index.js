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
        account_sid: config.twilio.TWILIO_ACCOUNT_SID,
        auth_token: config.twilio.TWILIO_AUTH_TOKEN,
        twilio_number: config.twilio.TWILIO_NUMBER,
        debug: false
    })

    var bot = controller.spawn();

    bot.type = SERVICE;

    controller.type = SERVICE;

    controller.bot = bot;

    controller.config.port = process.env.PORT;
    controller.startTicking();
    controller.createWebhookEndpoints(app, bot);

    controller.middleware.receive.use(smsCreateUserMiddleware(app));
    controller.middleware.receive.use(disableBotForUserMiddleware(app, SERVICE));

    (new Commands(app, controller)).init(EVENTS);

    app.mermaid.sms = controller;

};
