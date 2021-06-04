const user = require('../models/user');

const   express = require('express'),
        router = express.Router(),
        middleware = require('../middleware'),
        Song = require('../models/song.js'),
        User = require('../models/user.js');

router.get('/home', middleware.isLoggedIn, function(req, res){
    Song.find({}, function(err, allSongs){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/home.ejs', {song: allSongs});
        }
    });
});
        
router.get('/song/new', middleware.isLoggedIn, function(req, res){
    res.render('index/collection/new.ejs');
});

router.get('/song/:id', middleware.isLoggedIn, function(req, res){
    Song.findById(req.params.id).populate('comments').exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/show.ejs', {song: foundSong});
        }
    });
});

router.get('/song/:id/edit', middleware.isOwner, function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/edit.ejs', {song: foundSong});
        }
    });
});

router.get('/user/:id', middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            res.render('index/user/show.ejs', {user: foundUser})
        }
    });
});

module.exports = router;