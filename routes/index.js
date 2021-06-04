const   express = require('express'),
        router = express.Router(),
        middleware = require('../middleware'),
        Song = require('../models/song.js'),
        Artist = require('../models/artist.js');

router.get('/home', middleware.isLoggedIn, function(req, res){
    Song.find({}, function(err, allSongs){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'home', song: allSongs});
        }
    });
});

module.exports = router;