const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        middleware = require('../middleware'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                callback(null, './public/uploads/images');
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
        Album = require('../models/album.js'),
        User = require('../models/user.js'),
        Playlist = require('../models/playlist.js');

router.post('/', upload.single('artistImg'), function(req, res){
    req.body.artist.artistImg = '/uploads/images/' + req.file.filename;
    Artist.find({artistName: req.body.artist.artistName}, function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            if(foundArtist.length > 0) {
                req.flash('error', 'Artist already exists');
                res.redirect('/artist/new');
            } else {
                Artist.create(req.body.artist, function(err, createdArtist){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('==========New artist created==========\n' + createdArtist);
                        res.redirect('/artist/' + createdArtist._id);
                    }
                });
            }
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('index/index.ejs', {url: 'newArtist'});
});

router.get('/:id', middleware.isLoggedIn, function(req, res){
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
            res.render('index/index.ejs', {url: 'showArtist', artist: foundArtist});
        }
    });
});

router.get('/:id/edit', middleware.isLoggedIn, function(req, res){
    Artist.findById(req.params.id, function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'editArtist', artist: foundArtist});
        }
    });
});

router.put('/:id', upload.single('artistImg'), function(req, res){
    if(req.file) {
        req.body.artist.artistImg = '/uploads/images/' + req.file.filename;
    }
    Artist.findByIdAndUpdate(req.params.id, req.body.artist, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log('Artist updated');
            res.redirect('/artist/' + req.params.id); 
        }
    });
});

router.delete('/:id', async function(req, res){
    //delete artist -> each song -> each favSong in User -> album
    const deletedArtist = await Artist.findByIdAndRemove(req.params.id).exec();
    console.log('==========Deleted artist==========\n' + deletedArtist);
    await deletedArtist.album.forEach(albumId => {
        Album.findByIdAndRemove(albumId).exec();
    });
    console.log('All album deleted');
    if(deletedArtist.song.length > 0) {
        deletedArtist.song.forEach(async (songId) => {
            const foundSong = await Song.findByIdAndRemove(songId).exec();
            console.log("Deleted song: " + foundSong.songName);
            await Playlist.updateMany({}, {$pull: {song: songId}}).exec();
            foundSong.favBy.forEach(async (userId) => {
                await User.findByIdAndUpdate(userId, {$pull: {favSong: songId}}).exec();
            });
        });
        console.log("Pulled from playlist / favourite");
        res.redirect('/home');
    } else {
        res.redirect('/home');
    }
});

module.exports = router;