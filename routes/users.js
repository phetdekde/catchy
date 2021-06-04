const   express = require('express'),
        router = express.Router(),
        multer = require('multer'),
        path = require('path'),
        passport = require('passport'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                var destPath = './public/uploads/profileImage';
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
        User = require('../models/user.js'),
        Song = require('../models/song.js');

router.get('/:id', function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            res.render('index/index.ejs', {url: 'showUser', user: foundUser});
        }
    })
});

module.exports = router;