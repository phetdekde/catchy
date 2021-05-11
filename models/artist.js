const mongoose = require('mongoose');

var artistSchema = new mongoose.Schema({
    artistName: String,
    songs: [
        {
            _id: false,
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Collection'
            },
            songName: String 
        }
    ] 
});

module.exports = mongoose.model('Artist', artistSchema);