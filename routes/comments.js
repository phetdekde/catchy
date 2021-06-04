const   express = require('express'),
        router = express.Router({mergeParams: true}),
        Song = require('../models/song.js'),
        Comment = require('../models/comment.js');

router.get('/new', isLoggedIn, function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new.ejs', {song: foundSong});
        }
    });
});

router.post('/', isLoggedIn, function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err) {
            console.log(err);
            res.redirect('/collection/' + foundSong._id + '/comment/new');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; 
                    comment.save();
                    foundSong.comments.push(comment);
                    foundSong.save();
                    res.redirect('/collection/' + foundSong._id);
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