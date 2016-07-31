var _ = require("lodash");
var TextConfirmTemplate = require("./text-confirm");
var ejs = require("ejs");
var logger = require("../../../../../logger");
var Utils = require("../../../utils");

var orderNumber = 0;

var OrderConfirmationTemplate = TextConfirmTemplate.extend({
    getMessages: function(stateManager) {

      orderNumber++;

        var message = stateManager.context.prompt;

        return [{
            receipt: {
                "recipient_name": stateManager.context.memory.receipt.name,
                "order_number": Utils.padNumber(orderNumber,4),
                "currency": "USD",
                "payment_method": "XXXX-XXXX-XXXX-XXXX",
                "elements": [{
                    title: stateManager.context.memory.receipt.title,
                    subtitle: stateManager.context.memory.receipt.subtitle,
                    quantity: stateManager.context.memory.receipt.quantity,
                    price: stateManager.context.memory.receipt.price,
                    currency: "USD",
                    image_url: stateManager.context.memory.receipt.image_url

                }],
                "address": {
                    street_1: stateManager.context.memory.receipt.street_1,
                    city: stateManager.context.memory.receipt.city,
                    postal_code: stateManager.context.memory.receipt.zip,
                    state: stateManager.context.memory.receipt.state,
                    country: stateManager.context.memory.receipt.country
                },
                "summary": {
                    subtotal: stateManager.context.memory.receipt.subtotal,
                    shipping_cost: stateManager.context.memory.receipt.shipping_cost,
                    total_tax: stateManager.context.memory.receipt.tax,
                    total_cost: stateManager.context.memory.receipt.total
                }
            }
        }, {
            text: message,
            keywords: stateManager.context.keywords
        }];
    }
});

module.exports = OrderConfirmationTemplate;
