var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var PlatformSchema = new Schema({
	id : String
}, { strict : false }); //flexible schema


var MessageSchema = new Schema({
    user_id: String,
    text: String,
    type: String,
    context_uri: String,
    timestamp: Date,
    platform: PlatformSchema
}, { strict : false });


module.exports = mongoose.model('Message', MessageSchema);