var ejs = require("ejs");
var _ = require("lodash");
var crypto = require('crypto');
var logger = require("../logger");

var Utils = {};

Utils.getService = function(bot) {
    return bot.type;
};

Utils.getUserId = function(platform, username) {
    return platform + "-" + username;
};

Utils.injectVariables = function(string /*...arguments */ ) {

    var variablesArray = Array.prototype.slice.call(arguments, 1);

    var variables = _.extend.apply(null, variablesArray);

    return ejs.render(string, variables);

};


Utils.getResponse = function(messageObj) {

    if (messageObj.text && messageObj.text.length > 0) {
        return messageObj.text
    } else {
        return messageObj;
    }

}

Utils.hashString = function(string) {
    return crypto.createHash('md5').update(string).digest("hex");
}

Utils.padNumber = function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// Utils.emailTeam = function(message) {
//
//     var mailgun = require('mailgun-js')({
//         apiKey: config.mailgun.apiKey,
//         domain: config.mailgun.domain
//     });
//
//     var data = {
//         to: config.admin_emails,
//         from: 'No-Reply <noreply@mg.sagebots.com>',
//         subject: config.company + ' Bot Alert',
//         text: message
//     };
//
//     mailgun.messages().send(data, function(err, body) {
//         if (err) {
//             logger.error("Error sending message using mailgun: %s", err);
//         } else {
//             logger.info("E-mail sent to team.");
//         }
//     });
//
//
// }

module.exports = Utils;
