var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var botSchema = new Schema({
	createdBy: String,
	token: String,
	user_id: String
}, { _id : false });

var teamSchema = new Schema({
    id: String,
    createdBy: String,
    url: String,
    name: String,
    bot: [botSchema],
    token: String
}, { strict : false });


module.exports = mongoose.model('Team', teamSchema);