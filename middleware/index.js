const Song = require('../models/song.js'),
    Artist = require('../models/artist.js'),
    Album = require('../models/album.js');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in first.');
    res.redirect('/login');
}

// middlewareObj.isOwner = function(req, res, next){
//     if(req.isAuthenticated()) {
//         Song.findById(req.params.id, function(err, foundSong){
//             if(err) {
//                 req.flash('error', 'Song not found!')
//             } else {
//                 if(foundSong.author.equals(req.user._id) || req.user.isAdmin) {
//                     next();
//                 } else {
//                     req.flash('error', 'Permission denied!')
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'You need to sign in first.');
//         res.redirect('/login');
//     }
// }

// middlewareObj.isArtistOwner = function(req, res, next){
//     if(req.isAuthenticated()) {
//         Artist.findById(req.params.id, function(err, foundArtist){
//             if(err) {
//                 req.flash('error', 'Artist not found!')
//             } else {
//                 if(foundArtist.author.equals(req.user._id) || req.user.isAdmin) {
//                     next();
//                 } else {
//                     req.flash('error', 'Permission denied!')
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'You need to sign in first.');
//         res.redirect('/login');
//     }
// }

// middlewareObj.isAlbumOwner = function(req, res, next){
//     if(req.isAuthenticated()) {
//         Album.findById(req.params.id, function(err, foundAlbum){
//             if(err) {
//                 req.flash('error', 'Album not found!')
//             } else {
//                 if(foundAlbum.author.equals(req.user._id) || req.user.isAdmin) {
//                     next();
//                 } else {
//                     req.flash('error', 'Permission denied!')
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'You need to sign in first.');
//         res.redirect('/login');
//     }
// }

module.exports = middlewareObj;