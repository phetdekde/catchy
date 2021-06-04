const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    profileImg: String,
    email: String,
    isAdmin: {
        type: Boolean, 
        default: false
    },
    favSong: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Song'
            },
            songName: String
        }
    ],
    playlist: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Playlist'
            },
            playlistName: String
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);