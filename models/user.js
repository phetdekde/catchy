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
    isPremium: {
        type: Boolean,
        default: false
    },
    favSong: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    playlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);