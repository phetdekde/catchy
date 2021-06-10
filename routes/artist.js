const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        middleware = require('../middleware'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                var destPath = './public/uploads/';
                if(file.fieldname == 'artistImg'){
                    destPath += 'images';
                }
                callback(null, destPath);
            },
            filename: function(req, file, callback){
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        fileFilter = function(req, file, callback){
            if(file.fieldname == 'artistImg'){
                if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed only!'), false);
                }    
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
    Artist.create(req.body.artist, function(err, createdArtist){
        if(err) {
            console.log(err);
            req.flash('error', err);
            res.redirect('/home');
        } else {
            console.log('New artist created\n' + createdArtist);
            res.redirect('/artist/' + createdArtist._id);
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

router.get('/:id/edit', function(req, res){
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

    Artist.findByIdAndUpdate(req.params.id, req.body.artist, function(err, updatedArtist){
        if(err) {
            console.log(err);
            req.flash('error', err);
            res.redirect('/home');
        } else {
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
    deletedArtist.song.forEach(async (songId) => {
        const foundSong = await Song.findByIdAndRemove(songId).exec();
        await Playlist.updateMany({}, {$pull: {song: songId}}).exec();
        foundSong.favBy.forEach(async (userId) => {
            User.findByIdAndUpdate(userId, {$pull: {favSong: songId}}, function(err, foundUser){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/home');
                }
            });
        });
    });

    // Artist.findByIdAndRemove(req.params.id, async function(err, deletedArtist){
    //     if(err) {
    //         req.flash('error', err); 
    //         res.redirect('/home');
    //     } else {
    //         console.log('Delete artist==========\n' + deletedArtist);
    //         let deletedSong = await getDeletedSong(deletedArtist);
    //         console.log(deletedSong);
    //         Album.deleteMany(่
    //             {_id: deletedArtist.album},
    //             function(err){
    //                 if(err) {
    //                     console.log(err);
    //                 } else {
    //                     User.updateMany(
    //                         {_id: {deletedSong}},  
    //                         {$pull: {favSong: deletedSong._id}},
    //                         function(err, test){
    //                             if(err) {
    //                                 console.log(err);   
    //                             } else {
    //                                 req.flash('success', 'Delete successfully.');
    //                                 res.redirect('/home');
    //                             }
    //                         }
    //                     );
    //                 }
    //             }
    //         );
    //     }
    // });

    // Artist.findById(req.params.id, async function(err, foundArtist){
    //     if(err) {
    //         req.flash('error', err); 
    //         res.redirect('/home');
    //     } else {
    //         console.log('Found artist==========\n' + foundArtist);
    //         let foundSong = await getDeletedSong(foundArtist);
    //         console.log('Found song==========\n' + foundSong);
    //         ใช่ ลองดูนี่
    //         console.log(foundSong.)
    //         Song.find(
    //             {songName: foundSong.songName},
    //             function(err, found){
    //                 console.log(found);
    //             }
    //         );
    //         // User.find(
    //         //     {_id: deletedSong.favBy},
    //         //     function(err, test){
    //         //         if(err) {
    //         //             console.log(err);   
    //         //         } else {
    //         //             console.log(test);
    //         //             req.flash('success', 'Delete successfully.');
    //         //             res.redirect('/home');
    //         //         }
    //         //     }
    //         // );
    //     }
    // });

    // async function getDeletedSong(foundArtist) {
    //     const song = await Song.find({_id: foundArtist.song});
    //     await Song.deleteMany({_id: deletedArtist.song});
    //     return song;
    // }
});

module.exports = router;