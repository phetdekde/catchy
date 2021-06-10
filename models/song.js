const mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
    songName: String,
    songImg: String,
    lyric: String,
    songFile: String,
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
    favBy: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Song', songSchema);