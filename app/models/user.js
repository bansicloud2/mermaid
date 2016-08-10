var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var SessionSchema = new Schema({
    next_morning_checkin_time: Date,
    next_evening_checkin_time: Date
}, {
    _id : false,
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
    session: SessionSchema
}, {
    strict: false,
    minimize: false
});


module.exports = mongoose.model('User', UserSchema);
