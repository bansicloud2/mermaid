var _ = require("lodash");
var ejs = require("ejs");
var Templates = require("./templates");

var SimpleAdapter = function() {};

SimpleAdapter.prototype.getMessageObject = function(messageObj, cb) {

    if (messageObj.attachments) {

        var text = ejs.render(Templates.attachment, messageObj);

        messageObj.text = text;

        delete messageObj['attachments'];

    } else if (messageObj.receipt) {

      var text = ejs.render(Templates.receipt, messageObj);

      messageObj.text = text;

      delete messageObj['receipt'];

    }

    return messageObj;

}


module.exports = SimpleAdapter;
