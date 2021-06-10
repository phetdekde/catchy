const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        passport = require('passport'),
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
        middleware = require('../middleware'),
        User = require('../models/user.js'),
        Song = require('../models/song.js');

router.get('/:id', middleware.isLoggedIn, async function(req, res){
    const foundUser = await User.findById(req.params.id).exec();
    const favSong = await Song.find({_id: foundUser.favSong}).populate({path: 'artist', models: 'Artist', select: '_id artistName'}).sort({_id: -1}).exec();
    res.render('index/index.ejs', {url: 'showProfile', user: foundUser, song: favSong});
});

router.put('/:userId', upload.single('profileImg'), function(req,res){
    if(req.file) {
        req.body.user.profileImg = '/uploads/images/' + req.file.filename;
    }
    User.findByIdAndUpdate(req.params.userId, req.body.user, {new: true}, function(err, updatedUser){
        if(err) {
            console.log(err);
        } else {
            console.log('==========User updated==========\n' + updatedUser);
            res.redirect('/user/' + updatedUser._id);
        }
    });
});

module.exports = router;