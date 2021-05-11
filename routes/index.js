const   express = require('express'),
        router = express.Router(),
        User = require('../models/user.js'),
        passport = require('passport'),
        Collection = require('../models/collection.js');

router.get('/', function(req, res){
    Collection.find({}, function(err, allCollections){
        if(err) {
            console.log(err);
        } else {
            res.render('home.ejs', {collection: allCollections});
        }
    });
});

router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function(req, res){
});

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

module.exports = router;