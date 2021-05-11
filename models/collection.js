const mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema({
    songName: String,
    image: String,
    lyric: String,
    artist: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist'
        },
        artistName: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Collection', collectionSchema);