var _ = require("lodash");
var logger = require("../../logger");

var FacebookAdapter = function() {};

FacebookAdapter.prototype.getMessageObject = function(messageObj) {

    if (messageObj.attachments) {

        var attachment = {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': []
            },
        };

        attachment.payload.elements = _.map(messageObj.attachments, function(attachment, idx) {

            var optionsNum = idx + 1;

            logger.debug("Facebook Attachment: %s", JSON.stringify(attachment, null, 4));

            var buttons = [];

            var buttons = _.map(attachment.actions, function(action) {
                return {
                    "type": action.type || "postback",
                    "title": action.title,
                    "payload": action.payload,
                    "url": action.type === "web_url" ? action.uri : null
                }
            });

            return {
                'title': attachment.text,
                'image_url': attachment.image_url,
                'subtitle': attachment["sub_text"],
                'buttons': buttons
            }


        });

        messageObj.attachment = attachment;

        delete messageObj["text"];

    } else if (messageObj.receipt) {

        messageObj.attachment = {
            'type': 'template',
            'payload': {
                'template_type': 'receipt'
            }
        };

        _.extend(messageObj.attachment.payload, messageObj.receipt);

    } else if (messageObj.type === "img") {

        messageObj.attachment = {
            "type": "image",
            "payload": {
                "url": messageObj.url
            }
        }

        delete messageObj["url"]
        delete messageObj["type"]

    }

    if (messageObj.keywords) {

        messageObj.quick_replies = _.map(messageObj.keywords, function(keyword) {

            return {
                "content_type": "text",
                "title": keyword,
                "payload": keyword
            }
        });

        delete messageObj['keywords'];

    }

    logger.debug(JSON.stringify(messageObj, null, 4));

    return messageObj;

}


module.exports = FacebookAdapter;
