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
        Artist = require('../models/artist.js');

// router.post('/song', upload.any([{name: 'songImg'}, {name: 'songFile'}]), function(req, res){
//     req.body.song.songImg = '/uploads/images/' + req.files[0].filename;
//     req.body.song.songFile = '/uploads/songs/' + req.files[1].filename;
//     req.body.song.author = {
//         id: req.user._id,
//         username: req.user.username
//     };

//     Song.create(req.body.song, function(err, newlyCreated){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(newlyCreated);
//             Artist.findOneAndUpdate(
//                 { artistName: req.body.artist.artistName },
//                 { $push: { songs: { id: newlyCreated._id, songName: newlyCreated.songName } } },
//                 { upsert: true, new: true },
//                 function(err, artistCreated) {
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         newlyCreated.artist.id = artistCreated._id;
//                         newlyCreated.artist.artistName = artistCreated.artistName;
//                         newlyCreated.save();
//                         req.flash('success', 'New song created.')
//                         res.redirect('/song/' + newlyCreated._id);
//                     }
//                 }
//             );
//         }
//     });
// });

router.post('/song', upload.any([{name: 'songImg'}, {name: 'songFile'}]), function(req, res){
    Artist.findOne(
        {artistName: req.body.artist.artistName },
        function(err, artistFound) {
            if(err) {
                console.log(err);
            } else {
                if(!artistFound) {
                    req.flash('error', 'Artist not found!');
                    res.redirect('back');
                } else {
                    req.body.song.songImg = '/uploads/images/' + req.files[0].filename;
                    req.body.song.songFile = '/uploads/songs/' + req.files[1].filename;
                    req.body.song.author = {
                        id: req.user._id,
                        username: req.user.username
                    }
                    Song.create(req.body.song, function(err, createdSong){
                        if(err) {
                            console.log(err);
                        } else {
                            console.log('New song created\n' + createdSong);
                            createdSong.artist.id = foundArtist._id;
                            createdSong.artist.artistName = foundArtist.artistName;
                            createdSong.save();
                            foundArtist.song.id = createdSong._id;
                            foundArtist.song.songName = createdSong.songName;
                            foundArtist.save();
                            req.flash('success', 'New song created.');
                             res.redirect('/song/' + createdSong._id);
                        }
                    });
                }
            }
        }
    )
});

router.get('/song/new', middleware.isLoggedIn, function(req, res){
    res.render('index/index.ejs', {url: 'newSong'});
    // res.render('collections/new.ejs');
});

router.get('/song/:id', middleware.isLoggedIn, function(req, res){
    Song.findById(req.params.id).populate('comments').exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'showSong', song: foundSong});
        }
    });
});

router.get('/song/:id/edit', middleware.isOwner, function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'editSong', song: foundSong});
        }
    });
});

router.put('/song/:id', upload.any([{name: 'songImg'}, {name: 'songFile'}]), function(req, res){
    console.log(req.files);
    if(req.files[0]) {
        req.body.song.songImg = '/uploads/images/' + req.files[0].filename;
    }
    if(req.files[1]) {
        req.body.song.songFile = '/uploads/songs/' + req.files[1].filename;
    }
    Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, updatedSong){
        if(err) {
            req.flash('error', err);
            res.redirect('/home');
        } else {
            req.flash('success', 'Edit successfully.');
            res.redirect('/song/' + req.params.id);
        }
    });
});

router.delete('/song/:id', middleware.isOwner, function(req, res){
    Song.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            req.flash('error', err); 
            res.redirect('/home');
        } else {
            req.flash('success', 'Delete successfully.');
            res.redirect('/home');
        }
    });
});

module.exports = router;