const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    // Reference to the parent List
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
    },
    // Reference to the parent Board (useful for quick lookups and security)
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dueDate: {
        type: Date,
    },
    labels: [String],
    // Position within the list (crucial for drag-and-drop ordering)
    position: {
        type: Number,
        default: 0,
    },
    // Nested structure for comments and checklists (simplified for MVP)
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
    }],
    checklists: [{
        title: String,
        items: [{
            text: String,
            checked: { type: Boolean, default: false }
        }]
    }]
}, { timestamps: true });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;