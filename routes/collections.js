const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                callback(null, './public/uploads/');
            },
            filename: function(req, file, callback){
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        imageFilter = function(req, file, callback){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new Error('Only JPG, JPEG, PNG and GIF image files are allowed only!'), false);
            }
            callback(null, true);
        },
        upload = multer({storage: storage, fileFilter: imageFilter}),
        Collection = require('../models/collection.js'),
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

router.post('/', isLoggedIn, upload.single('image'), function(req, res){
    req.body.collection.image = '/uploads/' + req.file.filename;
    req.body.collection.author = {
        id: req.user._id,
        username: req.user.username
    };

    Collection.create(req.body.collection, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            Artist.findOneAndUpdate(
                { artistName: req.body.artist.artistName },
                { $push: { songs: { id: newlyCreated._id, songName: newlyCreated.songName } } },
                { upsert: true, new: true },
                function(err, artistCreated) {
                    if(err) {
                        console.log(err);
                    } else {
                        newlyCreated.artist.id = artistCreated._id;
                        newlyCreated.artist.artistName = artistCreated.artistName;
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