const Song = require('../models/song.js');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to sign in first.');
    res.redirect('/login');
}

middlewareObj.isOwner = function(req, res, next){
    if(req.isAuthenticated()) {
        Song.findById(req.params.id, function(err, foundSong){
            if(err) {
                req.flash('error', 'Song not found!')
            } else {
                if(foundSong.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'Permission denied!')
                }
            }
        });
    } else {
        req.flash('error', 'You need to sign in first.');
        res.redirect('/login');
    }
}

module.exports = middlewareObj;