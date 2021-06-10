const mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
    albumName: String,
    albumImg: String,
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    song: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Album', albumSchema);