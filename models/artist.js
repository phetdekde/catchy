const mongoose = require('mongoose');

var artistSchema = new mongoose.Schema({
    artistName: String,
    artistImg: String,
    song: [
        {
            _id: false,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    album: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Album'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Artist', artistSchema);