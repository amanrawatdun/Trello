const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // References to boards the user is a member of (optional for now)
    memberOfBoards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;