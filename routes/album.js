const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        middleware = require('../middleware'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                var destPath = './public/uploads/';
                if(file.fieldname == 'albumImg'){
                    destPath += 'images';
                }
                callback(null, destPath);
            },
            filename: function(req, file, callback){
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        fileFilter = function(req, file, callback){
            if(file.fieldname == 'albumImg'){
                if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed only!'), false);
                }    
            }
            callback(null, true);
        },
        upload = multer({storage: storage, fileFilter: fileFilter}),
        Song = require('../models/song.js'),
        Artist = require('../models/artist.js'),
        Album = require('../models/album.js');

router.post('/', upload.single('albumImg'), function(req, res){
    req.body.album.albumImg = '/uploads/images/' + req.file.filename;
    Album.create(req.body.album, function(err, createdAlbum){
        if(err) {
            console.log(err);
        } else {
            console.log('==========Album created==========\n' + createdAlbum);
            Song.updateMany(
                { _id: createdAlbum.song}, 
                { album: createdAlbum._id },
                function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Album in Song updated');
                        Artist.findOneAndUpdate(
                            { artistName: req.body.album.artistName },
                            { $push: {album: createdAlbum._id } },
                            function(err, foundArtist){
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log('Album in Artist updated');
                                    createdAlbum.artist = foundArtist._id;
                                    createdAlbum.save();
                                    res.redirect('/album/' + createdAlbum._id);
                                }
                            }
                        )
                    }
            });
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req, res){
    Artist.find({}).populate('song').exec(function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'newAlbum', artist: foundArtist});
        }
    });
});

router.get('/:id', middleware.isLoggedIn, function(req, res){
    Album.findById(req.params.id)
    .populate([
        {
            path: 'song', 
            model: 'Song',
            select: '_id songName songImg',
            populate: {
                path: 'artist',
                model: 'Artist',
                select: '_id artistName'
            }
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
            res.render('index/index.ejs', {url: 'viewAlbum', album: foundAlbum});
        }
    });
});

router.get('/:id/edit', middleware.isLoggedIn, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'editAlbum', album: foundAlbum});
        }
    });
});

router.put('/:id', upload.single('albumImg'), function(req, res){
    if(req.file) {
        req.body.album.albumImg = '/uploads/images/' + req.file.filename;
    }
    Album.findByIdAndUpdate(
        req.params.id, 
        req.body.album,
        function(err, updatedAlbum){
            if(err) {
                console.log(err); 
            } else {
                console.log('==========Updated album==========\n' + updatedAlbum);
                Song.updateMany({_id: updatedAlbum.song}, {$unset: {album: ""}}, function(err){
                    if(err) {
                        console.log(err);   
                    } else {
                        Song.updateMany({_id: req.body.album.song}, {album: req.params.id}, function(err){
                            if(err) {
                                console.log(err);
                            } else {        
                                if(req.body.album.song === undefined) {
                                    updatedAlbum.song = [];
                                    updatedAlbum.save();
                                }         
                                res.redirect('/album/' + req.params.id); 
                            }
                        });
                    }
                });
            }   
        }
    );
});

router.delete('/:id', async function(req, res){
    const deletedAlbum = await Album.findByIdAndRemove(req.params.id).exec();
    console.log('==========Deleted album==========\n' + deletedAlbum);
    await Artist.findByIdAndUpdate(deletedAlbum.artist, {$pull: {album: deletedAlbum._id}}).exec();
    await Song.updateMany({_id: deletedAlbum.song}, {$unset: {album: deletedAlbum._id}}).exec();
    console.log('Pulled from artist / Unset album field in song');
    res.redirect('/home');
});

module.exports = router;