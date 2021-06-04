const mongoose = require('mongoose');

var artistSchema = new mongoose.Schema({
    artistName: String,
    artistImg: String,
    song: [
        {
            _id: false,
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Collection'
            },
            songName: String 
        }
    ],
    album: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Album'
            },
            albumName: String
        }
    ]
});

module.exports = mongoose.model('Artist', artistSchema);