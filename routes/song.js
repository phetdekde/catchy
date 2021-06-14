const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        middleware = require('../middleware'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                var destPath = './public/uploads/';
                if(file.fieldname == 'songImg'){
                    destPath += 'images';
                } else if(file.fieldname == 'songFile'){
                    destPath += 'songs';
                }
                callback(null, destPath);
            },
            filename: function(req, file, callback){
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        fileFilter = function(req, file, callback){
            if(file.fieldname == 'songImg'){
                if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed only!'), false);
                }    
            } else if(file.fieldname == 'songFile'){
                if(!file.originalname.match(/\.(mp3)$/i)) {
                    return callback(new Error('Only MP3 files are allowed!'), false);
                } 
            }
            callback(null, true);
        },
        upload = multer({storage: storage, fileFilter: fileFilter}),
        Song = require('../models/song.js'),
        Artist = require('../models/artist.js'),
        Album = require('../models/album.js'),
        User = require('../models/user.js'),
        Playlist = require('../models/playlist');;

router.post('/', upload.any([{name: 'songImg'}, {name: 'songFile'}]), function(req, res){
    Artist.findOne(
        {artistName: req.body.artist.artistName },
        function(err, foundArtist) {
            if(err) {
                console.log(err);
            } else {
                if(!foundArtist) {
                    req.flash('error', 'Artist not found!');
                    res.redirect('/song/new');
                } else {
                    console.log("Found artist: " + foundArtist.artistName);
                    req.body.song.songImg = '/uploads/images/' + req.files[0].filename;
                    req.body.song.songFile = '/uploads/songs/' + req.files[1].filename;
                    Song.create(req.body.song, function(err, createdSong){
                        if(err) {
                            console.log(err);
                        } else {
                            console.log('==========Song created==========\n' + createdSong);
                            createdSong.artist = foundArtist._id;
                            createdSong.save();
                            foundArtist.song.push(createdSong._id);
                            foundArtist.save();
                            res.redirect('/song/' + createdSong._id);
                        }
                    });
                }
            }
        }
    )
});

router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('index/index.ejs', {url: 'newSong'});
});

router.get('/:id', middleware.isLoggedIn, function(req, res){
    Song.findById(req.params.id).populate('artist').exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'showSong', song: foundSong});
        }
    });
});

router.get('/:id/edit', middleware.isLoggedIn, function(req, res){
    Song.findById(req.params.id).populate('artist').exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'editSong', song: foundSong});
        }
    });
});

router.put('/:id', upload.any([{name: 'songImg'}, {name: 'songFile'}]), function(req, res){
    req.files.forEach(element => {
        if(element) {
            if(element.fieldname == 'songImg') {
                req.body.song.songImg = '/uploads/images/' + element.filename;
            } else if (element.fieldname == 'songFile') {
                req.body.song.songFile = '/uploads/songs/' + element.filename;
            }
        }
    });
    Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, updatedSong){
        if(err) {
            console.log(err);
        } else {
            console.log('Song updated');
            res.redirect('/song/' + req.params.id); 
        }
    });
});

router.delete('/:id', async function(req, res){
    const deletedSong = await Song.findByIdAndRemove(req.params.id).exec();
    console.log('==========Deleted song==========\n' + deletedSong);
    await Artist.findByIdAndUpdate(deletedSong.artist, {$pull: {song: deletedSong._id}}).exec();
    await Album.findByIdAndUpdate(deletedSong.album, {$pull: {song: deletedSong._id}}).exec();
    await User.updateMany({_id: deletedSong.favBy}, {$pull: {favSong: deletedSong._id}}).exec();
    await Playlist.updateMany({}, {$pull: {song: deletedSong._id}}).exec();
    console.log('Pulled song from artist / album / favourite / playlist');
    res.redirect('/home');
});

module.exports = router;