const mongoose = require('mongoose');

var playlistSchema = new mongoose.Schema({
    playlistName: String,
    playlistImg: String,
    song: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Playlist', playlistSchema);