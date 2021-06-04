const mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
    songName: String,
    songImg: String,
    lyric: String,
    songFile: String,
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

module.exports = mongoose.model('Song', songSchema);