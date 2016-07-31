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

module.exports = Utils;
