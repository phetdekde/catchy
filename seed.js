const mongoose = require('mongoose');
var Collection = require('./models/collection');
var Comment = require('./models/comment');
var Artist = require('./models/artist')
const User = require('./models/user');

// function seedDB() {
//     Collection.remove({}, function(err){
//         if(err) {
//             console.log(err);
//         }
//         console.log('Remove completed.');
//         data.forEach(function(seed){
//             Collection.create(seed, function(err, collection){
//                 if(err) {
//                     console.log(err);
//                 } else {
//                     console.log('New data added');
//                 }
//             });
//         });
//     });
// }

function seedDB() {
    Collection.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Remove completed.');
    });
    Artist.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Remove completed.');
    });
    Comment.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Remove completed.');
    });
    User.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('Remove completed.');
    });
    
}

module.exports = seedDB;