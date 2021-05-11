const mongoose = require('mongoose');
var Collection = require('./models/collection');
var Comment = require('./models/comment');

// var data = [
//     {
//         name: 'Tokino Sora', 
//         image: 'https://static.wikia.nocookie.net/virtualyoutuber/images/4/4b/Tokino_Sora_-_Profile_Picture.jpg',
//         desc: 'xxx'
//     },
//     {
//         name: 'Roboco', 
//         image: 'https://static.wikia.nocookie.net/virtualyoutuber/images/8/8e/Roboco_-_Profile_Picture.jpg',
//         desc: 'xxx'
//     },
//     {
//         name: 'Sakura Miko', 
//         image: 'https://static.wikia.nocookie.net/virtualyoutuber/images/5/54/Sakura_Miko_-_Profile_Picture.jpg',
//         desc: 'xxx'
//     },
//     {
//         name: 'Hoshimachi Suisei', 
//         image: 'https://static.wikia.nocookie.net/virtualyoutuber/images/6/61/Hoshimachi_Suisei_-_Profile_Picture.png',
//         desc: 'xxx'
//     } 
// ];

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
}

module.exports = seedDB;