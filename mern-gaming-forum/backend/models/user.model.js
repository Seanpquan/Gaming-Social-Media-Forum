const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    password: { type: String, required: true, unique: false, trim: true, minlength: 3 },
    pic: { type: String, required: false, unique: false},
    bio: {type: String, required: false, unique: false},
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema); 

module.exports = User;