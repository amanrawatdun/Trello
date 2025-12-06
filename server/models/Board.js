const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    // Reference to the User who created the board
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // References to all Users who can access the board
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // References to all Lists on this board (order matters for UI)
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List' // We'll define the List model soon
    }],
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;