const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        middleware = require('../middleware'),
        path = require('path'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                var destPath = './public/uploads/images';
                callback(null, destPath);
            },
            filename: function(req, file, callback){
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        fileFilter = function(req, file, callback){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed only!'), false);
            }            
            callback(null, true);
        },
        upload = multer({storage: storage, fileFilter: fileFilter}),
        Song = require('../models/song.js'),
        Artist = require('../models/artist.js'),
        User = require('../models/user.js'),
        Playlist = require('../models/playlist');;

router.get('/home', middleware.isLoggedIn, function(req, res){
    res.render('index/index.ejs', {url: 'home'});
});

router.get('/search', middleware.isLoggedIn, function(req, res){
    res.render('index/index.ejs', {url: 'search'});
});

router.get('/allplaylist/:userId', middleware.isLoggedIn, async function(req, res){
    const foundPlaylist = await Playlist.find({author: req.params.userId}).exec();
    const owner = await User.findById(req.params.userId).select('_id username').exec();
    res.render('index/index.ejs', {url: 'showAllPlaylist', playlist: foundPlaylist, user: owner});
});

router.post('/playlist', upload.single('playlistImg'), function(req, res){
    if(req.file) {
        req.body.playlist.playlistImg = '/uploads/images/' + req.file.filename;
    } else {
        req.body.playlist.playlistImg = '/images/logo.jpg';
    }
    req.body.playlist.author = req.user._id;
    Playlist.create(req.body.playlist, function(err, createdPlaylist){
        if(err) {
            console.log(err);
        } else {
            User.findByIdAndUpdate(req.user._id, {$push: {playlist: createdPlaylist._id}}, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log('==========Playlist created==========\n' + createdPlaylist);
                    res.redirect('/playlist/' + createdPlaylist._id);
                }
            });
        }
    });
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
            res.render('index/index.ejs', {url: 'showPlaylist', playlist: foundPlaylist});
        }
    });
});

router.put('/playlist/:playlistId', upload.single('playlistImg'), function(req, res){
    if(req.file) {
        req.body.playlist.playlistImg = '/uploads/images/' + req.file.filename;
    }
    Playlist.findByIdAndUpdate(req.params.playlistId, req.body.playlist, {new: true}, function(err, createdPlaylist){
        if(err) {
            console.log(err);
        } else {
            console.log('==========Playlist updated==========\n' + createdPlaylist);
            res.redirect('/playlist/' + req.params.playlistId);
        }
    });
});

router.delete('/playlist/:playlistId', function(req, res){
    Playlist.findByIdAndDelete(req.params.playlistId, function(err, deletedPlaylist){
        if(err) {
            console.log(err);
        } else {
            console.log('==========Playlist deleted==========\n' + deletedPlaylist);
            User.findByIdAndUpdate(deletedPlaylist.author, {$pull: {playlist: deletedPlaylist._id}}, function(err){
                if(err) {
                    console.log(err);   
                } else {
                    console.log('Removed playlist from user');
                    res.redirect('/allplaylist/' + deletedPlaylist.author);
                }
            });
        }
    });
});

router.get('/premium', middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.user._id, {isPremium: true}, function(err, updatedUser){
        if(err) {
            console.log(err);
        } else {
            console.log(updatedUser + ' is now premium :D');
            res.redirect('/home');
        }
    });
});

module.exports = router;