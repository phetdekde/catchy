const   express = require('express'),
        router = express.Router({mergeParams: true}),
        Collection = require('../models/collection.js'),
        Comment = require('../models/comment.js');

router.get('/new', isLoggedIn, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new.ejs', {collection: foundCollection});
        }
    });
});

router.post('/', isLoggedIn, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err) {
            console.log(err);
            res.redirect('/collection/' + foundCollection._id + '/comment/new');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; 
                    comment.save();
                    foundCollection.comments.push(comment);
                    foundCollection.save();
                    res.redirect('/collection/' + foundCollection._id);
                }
            });
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