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
        User = require('../models/user.js'),
        Song = require('../models/song.js');

router.get('/', function(req, res){
    Song.find({}).populate('artist').exec(function(err, allSongs){
        if(err) {
            console.log(err);
        } else {
            res.render('home/home.ejs', {song: allSongs});
        }
    });
});

router.get('/register', function(req, res){
    res.render('home/register.ejs');
});

router.post('/register', upload.single('profileImg'), function(req, res){
    req.body.profileImg = '/uploads/images/' + req.file.filename;
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        profileImg: req.body.profileImg
    });
    if(req.body.adminCode === 'iamadmin'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash('error', err.message);
            return res.render('home/register.ejs');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/home');
        });
    });
});

router.get('/login', function(req, res){
    res.render('home/login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true,
        failureFlash: 'Invalid username or password'
    }), 
    function(req, res){}
);

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

module.exports = router;