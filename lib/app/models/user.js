var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CheckInSchema = new Schema({
    code: String,
    route: {
        type: String
    },
    type: String,
    active: {
        type: Boolean
    },
    date: Date
}, {
    _id: false,
    strict: false
});


var SessionSchema = new Schema({
    checkins: [CheckInSchema]
}, {
    _id: false,
    strict: false
});

var UserSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    type: String,
    current_uri: String,
    platform: Object,
    last_message: Object,
    last_botkit_message_obj: Object,
    triggers: {
        type: Object,
        default: {}
    },
    unread_messages: {
        type: Number,
        default: 0
    },
    bot_disabled: {
        type: Boolean,
        default: false
    },
    session: SessionSchema,
    system: Object
}, {
    strict: false,
    minimize: false
});

module.exports = mongoose.model('User', UserSchema);
