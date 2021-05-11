const   express = require('express'),
        router = express.Router(),
        Collection = require('../models/collection.js');
        Artist = require('../models/artist.js');

router.get('/', isLoggedIn, function(req, res){
    Collection.find({}, function(err, allCollections){
        if(err) {
            console.log(err);
        } else {
            res.render('collections/index.ejs', {collection: allCollections});
        }
    });
});

router.post('/', isLoggedIn, function(req, res){
    var songName = req.body.songName;
    var image = req.body.image;
    var lyric = req.body.lyric;
    var artist = req.body.artist;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCollection = {songName: songName, image: image, lyric: lyric, artist: artist, author: author};
    Collection.create(newCollection, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            Artist.findOneAndUpdate(
                { artistName: artist.artistName },
                { $push: { songs: { id: newlyCreated._id, songName: newlyCreated.songName } } },
                { upsert: true, new: true },
                function(err, artistCreated) {
                    if(err) {
                        console.log(err);
                    } else {
                        newlyCreated.artist.id = artistCreated._id;
                        newlyCreated.save();
                        res.redirect('/collection/' + newlyCreated._id);
                    }
                }
            );
        }
    });
});

router.get('/new', isLoggedIn, function(req, res){
    res.render('collections/new.ejs');
});

router.get('/:id', isLoggedIn, function(req, res){
    Collection.findById(req.params.id).populate('comments').exec(function(err, foundCollection){
        if(err) {
            console.log(err);
        } else {
            res.render('collections/show.ejs', {collection: foundCollection});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;