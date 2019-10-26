const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  name: { type: String },

  email: { type: String, required: true },

  src: { type: String, default: 'Other' },

  joinDate: { type: Date, Default: Date.now }

});

module.exports.UserModel = mongoose.model('User', UserSchema);
