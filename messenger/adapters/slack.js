var _ = require("lodash");

var colors = ["#6B6054", "#929487", "#A1B0AB", "#C3DAC3", "#D5ECD4"]

var SlackAdapter = function(config) {

    this.currentIconUrl = config.icon_url;
    this.currentUsername = config.bot_username;

};

SlackAdapter.prototype.getMessageObject = function(messageObj) {

    var baseProperties = {
        icon_url: this.currentIconUrl,
        username: this.currentUsername
    };

    if (messageObj.attachments) {

        messageObj.attachments = _.map(messageObj.attachments, function(attachment, idx) {

            var i = idx % colors.length;

            attachment.fallback = attachment.text;

            attachment.title = attachment.text;

            attachment.title_link = attachment.resource_url;

            attachment.thumb_url = attachment.image_url;

            attachment.attachment_type = 'default';

            attachment.callback_id = '123';

            attachment.color = colors[i];

            delete attachment['image_url'];
            delete attachment['text'];

            attachment.actions = _.map(attachment.actions, function(action, idx) {

                return {
                    name: action.title,
                    text: action.title,
                    value: action.payload,
                    type: "button"
                }
            });

            return attachment;
        });
    } else if (messageObj.receipt) {

        messageObj.text = "Here's your order confirmation:";

        var items = _.map(messageObj.receipt.elements, function(element) {
            return {
                fallback: "Item",
                thumb_url: element.image_url,
                fields: [{
                    value: element.title
                }, {
                    value: element.quantity + "x " + element.currency + " " + element.price
                }]
            }
        });

        messageObj.attachments = items.concat([{
            fallback: "Address",
            pretext: "Address:",
            fields: [{
                title: "Street",
                value: messageObj.receipt.address.street_1
            }, {
                title: "City",
                value: messageObj.receipt.address.city
            }, {
                title: "State",
                value: messageObj.receipt.address.state
            }, {
                title: "Zip",
                value: messageObj.receipt.address.postal_code
            }, {
                title: "Country",
                value: messageObj.receipt.address.country
            }]

        }, {
            fallback: "Summary",
            pretext: "Summary:",
            fields: [{
                title: "Subtotal",
                value: "$" + messageObj.receipt.summary.subtotal
            }, {
                title: "Shipping Cost",
                value: "$" + messageObj.receipt.summary.shipping_cost
            }, {
                title: "Tax",
                value: "$" + messageObj.receipt.summary.total_tax
            }, {
                title: "Total",
                value: "$" + messageObj.receipt.summary.total_cost
            }]
        }]);

    }

    return _.extend(messageObj, baseProperties);

}


module.exports = SlackAdapter;
