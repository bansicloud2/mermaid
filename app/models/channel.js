var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var channelSchema = new Schema({}, { strict : false });


module.exports = mongoose.model('Channel', channelSchema);