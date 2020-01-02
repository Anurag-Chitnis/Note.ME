const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String,
        default: "user.svg"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('myUsers', UserSchema);
module.exports = User;