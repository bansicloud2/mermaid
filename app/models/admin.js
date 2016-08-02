var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const AdminSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true },
  createdAt: {type: Date, 'default': Date.now},
  updatedAt: {type: Date, 'default': Date.now}
});


module.exports = mongoose.model('Admin', AdminSchema);