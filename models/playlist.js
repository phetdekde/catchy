const mongoose = require('mongoose');

var playlistSchema = new mongoose.Schema({
    playlistName: String,
    playlistImg: String,
    song: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Song'
            },
            songName: String
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model('Playlist', playlistSchema);