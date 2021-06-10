const mongoose = require('mongoose');
const Song = require('./models/song');
const Artist = require('./models/artist');
const Album = require('./models/album');
const User = require('./models/user');
const Playlist = require('./models/playlist');

// function test() {
//     var data = { artistName: 'Yorushika'}
//     Artist.create(data, function(err, artistCreated){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(artistCreated);
//         }
//     });
// }

// module.exports = test;

function seedDB() {
    Song.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Song removed.');
    });
    Artist.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Artist removed.');
    });
    Album.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Album removed.');
    }); 
    User.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('User removed.');
    }); 
    Playlist.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Playlist removed.');
    }); 
}

module.exports = seedDB;