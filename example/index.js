var mermaid = require("../lib");
var logger = require("../lib/logger");
var config = require("./config");

var facebookRegistered = (process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN && process.env.FACEBOOK_VERIFY_TOKEN);
var twilioRegistered = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_NUMBER)
var slackRegistered = (process.env.SLACK_CLIENT_SECRET && process.env.SLACK_CLIENT_ID)

if (facebookRegistered || twilioRegistered || slackRegistered) {

    var services = {
        facebook: facebookRegistered,
        twilio: twilioRegistered,
        slack: slackRegistered
    };

    mermaid(config, services);

} else {
    return logger.error("Please specify one of the following sets of environment variables: \n\n \
      Facebook - FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN, FACEBOOK_VERIFY_TOKEN \n \
      Slack - SLACK_CLIENT_SECRET, SLACK_CLIENT_ID \n \
      Twilio - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER \n\n \
      🐬  Mermaid\
    \
    ");
}
