const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username  : { type: String, required: true, trim: true},
    googleId  : { type: String, required: true, trim: true},
    thumbnail : { type: String },
    createdAt : { type: Number, default: Date.now() }
});

var User = mongoose.model('user', UserSchema);
module.exports = User;
