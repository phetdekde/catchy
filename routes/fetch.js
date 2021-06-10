const   express = require('express'),
        router = express.Router(),
        middleware = require('../middleware'),
        Song = require('../models/song.js'),
        User = require('../models/user.js'),
        Artist = require('../models/artist.js'),
        Album = require('../models/album.js'),
        Playlist = require('../models/playlist.js');

router.get('/home', middleware.isLoggedIn, async function(req, res){
    const allSong = await Song.find({}).populate({path: 'artist', models: 'Artist', select: '_id artistName'}).sort({_id: -1}).exec();
    const allArtist = await Artist.find({}).sort({_id: -1}).exec();
    const allAlbum = await Album.find({}).populate({path: 'artist', models: 'Artist', select: '_id artistName'}).sort({_id: -1}).exec();
    const allPlaylist = await Playlist.find({}).sort({_id: -1}).exec();
    res.render('index/collection/home.ejs', {song: allSong, artist: allArtist, album: allAlbum, playlist: allPlaylist});
});

router.get('/search', middleware.isLoggedIn, function(req, res){
    res.render('index/collection/search.ejs');
});

router.get('/allplaylist/:userId', middleware.isLoggedIn, async function(req, res){
    const foundPlaylist = await Playlist.find({author: req.params.userId}).exec();
    const owner = await User.findById(req.params.userId).select('_id username').exec();
    res.render('index/collection/showAllPlaylist.ejs', {url: 'showAllPlaylist', playlist: foundPlaylist, user: owner});
});

router.get('/playlist/:playlistId', middleware.isLoggedIn, function(req, res){
    Playlist.findById(req.params.playlistId)
    .populate([
        {
            path: 'song', 
            model: 'Song',
            select: '_id songName songImg',
            populate: {
                path: 'artist', 
                select: '_id artistName', 
                model: 'Artist'
            }
        },
        {
            path: 'author',
            model: 'User',
            select: 'username'
        }
    ])
    .exec(function(err, foundPlaylist){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/showPlaylist.ejs', {playlist: foundPlaylist});
        }
    });
});

router.get('/user/:id', middleware.isLoggedIn, async function(req, res){
    const foundUser = await User.findById(req.params.id).exec();
    const favSong = await Song.find({_id: foundUser.favSong}).populate({path: 'artist', models: 'Artist', select: '_id artistName'}).sort({_id: -1}).exec();
    res.render('index/user/showProfile.ejs', {user: foundUser, song: favSong});
});
        
router.get('/song/new', middleware.isLoggedIn, function(req, res){
    res.render('index/collection/song/newSong.ejs');
});

router.get('/song/:id', middleware.isLoggedIn, function(req, res){
    Song.findById(req.params.id).populate('artist').exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/song/showSong.ejs', {song: foundSong});
        }
    });
});

router.get('/song/:id/edit', function(req, res){
    Song.findById(req.params.id).populate('artist').exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/song/editSong.ejs', {song: foundSong});
        }
    });
});

router.get('/artist/new', middleware.isLoggedIn, function(req, res){
    res.render('index/collection/artist/newArtist.ejs');
});

router.get('/artist/:id', middleware.isLoggedIn, function(req, res){
    Artist.findById(req.params.id)
    .populate([
        {
            path: 'song',
            model: 'Song',
            select: '_id songName songImg'
        },
        {
            path: 'album',
            model: 'Album',
            select: '_id albumName albumImg'
        }
    ])
    .exec(function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/artist/showArtist.ejs', {artist: foundArtist});
        }
    });
});

router.get('/artist/:id/edit', middleware.isLoggedIn, function(req, res){
    Artist.findById(req.params.id, function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/artist/editArtist.ejs', {artist: foundArtist});
        }
    });
});

router.get('/album/new', middleware.isLoggedIn, function(req, res){
    Artist.find({}).populate('song').exec(function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/album/newAlbum.ejs', {artist: foundArtist});
        }
    });
});

router.get('/album/:id', middleware.isLoggedIn, function(req, res){
    Album.findById(req.params.id)
    .populate([
        {
            path: 'song', 
            model: 'Song',
            select: '_id songName songImg'
        },
        {
            path: 'artist',
            model: 'Artist',
            select: '_id artistName'
        }
    ])
    .exec(function(err, foundAlbum){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/album/showAlbum.ejs', {album: foundAlbum});
        }
    });
});

router.get('/album/:id/edit', middleware.isLoggedIn, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err) {
            console.log(err);
        } else {
            res.render('index/collection/album/editAlbum.ejs', {album: foundAlbum});
        }
    });
});

module.exports = router;