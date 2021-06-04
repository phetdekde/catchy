const mongoose = require('mongoose');
const Song = require('./models/song');
const Comment = require('./models/comment');
const Artist = require('./models/artist')
const User = require('./models/user');

function test() {
    var data = { artistName: 'Yorushika'}
    Artist.create(data, function(err, artistCreated){
        if(err) {
            console.log(err);
        } else {
            console.log(artistCreated);
        }
    });
}

module.exports = test;

// function seedDB() {
//     Song.remove({}, function(err){
//         if(err) {
//             console.log(err);
//         }
//         console.log('Remove completed.');
//     });
//     Artist.remove({}, function(err){
//         if(err) {
//             console.log(err);
//         }
//         console.log('Remove completed.');
//     });
//     Comment.remove({}, function(err){
//         if(err) {
//             console.log(err);
//         }
//         console.log('Remove completed.');
//     });
//     User.remove({}, function(err){
//         if(err) {
//             console.log(err);
//         }
//         console.log('Remove completed.');
//     }); 
// }

// module.exports = seedDB;