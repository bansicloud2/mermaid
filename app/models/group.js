var mongoose = require('mongoose');
var dot = require("dot-object");

var group_settings = {
    trigger_text: {
        type: "string",
        value: "HELL YES",
        required: true
    },
    uri: {
        base: {
            type: "string",
            value: "/purchase",
            required: true
        },
        params: {
            product_id: {
                type: "string",
                value: "",
                required: true
            },
            image_url: {
                type: "string",
                value: "",
                required: true
            },
            item_price: {
                type: "string",
                value: "",
                required: true
            },
            item_name: {
                type: "string",
                value: "",
                required: true
            },
            vendor_code: {
                type: "string",
                value: "EZRAS",
                required: true
            },
            qty: {
                type: "string",
                value: "1",
                required: true
            },
            tax_rate: {
                type: "string",
                value: ".075",
                required: true
            },
            discount_amount: {
                type: "string",
                value: "0",
                required: true
            }

        }
    },

};

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var getMongooseConfig = function(config) {

    var typesMap = {
        "string": String
    }

    var mongooseConfig = {};

    var resolvedKey;

    var resolveObject = function(obj, baseKey) {

        resolvedKey = "";

        for (var key in obj) {

            var value = obj[key];

            resolvedKey = baseKey ? baseKey + "." + key : key;

            if (value.type) {

                dot.set(resolvedKey, {
                    type: typesMap[value.type],
                    required: false,
                    default: value.value
                }, mongooseConfig)

            } else {

                resolveObject(value, resolvedKey)

            }

        }

    }


    resolveObject(config);

    return mongooseConfig;

};

var GroupSchema = new Schema({
    users: Array,
    created_at: {
        type: Date,
        default: Date.now
    },
    config: getMongooseConfig(group_settings)
}, {
    strict: false
});


module.exports = mongoose.model('Group', GroupSchema);
