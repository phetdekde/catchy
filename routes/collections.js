const   express = require('express'),
        router = express.Router(),
        Collection = require('../models/collection.js');

router.get('/', function(req, res){
    Collection.find({}, function(err, allCollections){
        if(err) {
            console.log(err);
        } else {
            res.render('collections/index.ejs', {collection: allCollections});
        }
    });
});

router.post('/', isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCollection = {name: name, image: image, desc: desc, author: author};
    Collection.create(newCollection, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/collection');
        }
    });
});

router.get('/new', isLoggedIn, function(req, res){
    res.render('collections/new.ejs');
});

router.get('/:id', function(req, res){
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