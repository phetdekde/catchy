const   express = require('express'),
        router = express.Router(),
        Song = require('../models/song.js'),
        User = require('../models/user.js'),
        Artist = require('../models/artist.js'),
        Album = require('../models/album.js'),
        Playlist = require('../models/playlist.js');

//return all artist
router.get('/allArtist', function(req, res){
    Artist.find({}, function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            res.json(foundArtist);
        }
    });
});

//return all playlist that doesn't have this song
router.get('/allPlaylist/:songId', async function(req, res){
    const foundUser = await User.findById(req.user._id).exec();
    Playlist.find(
        {
            $and: [
                {_id : foundUser.playlist}, 
                {song: {$nin: [req.params.songId]}}
            ]
        },
        async function(err, foundPlaylist){
        if(err) {
            console.log(err);
        } else {
            res.json(foundPlaylist); 
        }
    });
});

//search song
router.get('/song/:query/:sort', function(req, res){
    if(req.params.sort === 'alphabet') {
        Song.find({songName: {$regex: req.params.query, $options: 'i'}})
        .populate({
            path: 'artist',
            model: 'Artist',
            select: '_id artistName'
        })
        .sort({songName: 1})
        .exec(function(err, foundSong){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/songSkeleton.ejs', {song: foundSong});
            }
        });
    } else if(req.params.sort === 'date') {
        Song.find({songName: {$regex: req.params.query, $options: 'i'}})
        .populate({
            path: 'artist',
            model: 'Artist',
            select: '_id artistName'
        })
        .sort({_id: -1})
        .exec(function(err, foundSong){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/songSkeleton.ejs', {song: foundSong});
            }
        });
    }
});

//search artist
router.get('/artist/:query/:sort', function(req, res){
    if(req.params.sort === 'alphabet') {
        Artist.find({artistName: {$regex: req.params.query, $options: 'i'}})
        .sort({artistName: 1})
        .exec(function(err, foundArtist){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/artistSkeleton.ejs', {artist: foundArtist});
            }
        });
    } else if(req.params.sort === 'date') {
        Artist.find({artistName: {$regex: req.params.query, $options: 'i'}})
        .sort({_id: -1})
        .exec(function(err, foundArtist){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/artistSkeleton.ejs', {artist: foundArtist});
            }
        });
    }
});

//search album
router.get('/album/:query/:sort', function(req, res){
    if(req.params.sort === 'alphabet') {
        Album.find({albumName: {$regex: req.params.query, $options: 'i'}})
        .populate('artist')
        .sort({albumName: 1})
        .exec(function(err, foundAlbum){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/albumSkeleton.ejs', {album: foundAlbum});
            }
        });
    } else {
        Album.find({albumName: {$regex: req.params.query, $options: 'i'}})
        .populate('artist')
        .sort({_id: -1})
        .exec(function(err, foundAlbum){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/albumSkeleton.ejs', {album: foundAlbum});
            }
        });
    }
});

//search artist
router.get('/songByArtistName/:artistName', function(req, res){
    Artist.findOne({artistName: req.params.artistName}).populate('song').exec(function(err, foundArtist){
        if(err) {
            console.log(err);
        } else {
            if(!foundArtist) {
                res.json('Artist not found');
            } else {
                let songList = [];
                for (let i = 0; i < foundArtist.song.length; i++) {
                    songList[i] = foundArtist.song[i]._id;
                }
                //only return song that isn't in any album
                Song.find({_id: songList, album: {$exists: false}}, function(err, foundSong){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Found song: ' + foundSong)
                        res.json(foundSong);
                    }
                });
            }
        }
    });
});

//seach song in this album
router.get('/songByAlbumId/inAlbum/:albumId', function(req, res){
    Album.findById(req.params.albumId).populate('song').exec(function(err, foundAlbum){
        if(err) {
            console.log(err);
        } else {
            console.log('Songs (in this album): ' + foundAlbum.song)
            res.json(foundAlbum.song);
        }
    });
});

//search song that isn't in this album
router.get('/songByAlbumId/notInAlbum/:albumId', function(req, res){
    Album.findById(req.params.albumId, function(err, foundAlbum){
        if(err) {
            console.log(err);
        } else {
            Artist.findById(foundAlbum.artist, function(err, foundArtist){
                if(err) {
                    console.log(err);
                } else {
                    Song.find({_id: foundArtist.song, album: {$exists: false}}, function(err, foundSong){
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("Songs (not in any album): " + foundSong);
                            res.json(foundSong);
                        }
                    });
                }
            });
        }
    });
});

//add or remove from favourites
router.get('/updateFavourite/:songId', async function(req, res){
    const foundUser = await User.findByIdAndUpdate(req.user._id, {$pull: {favSong: req.params.songId}}).exec();
    if(!foundUser.favSong.includes(req.params.songId)) {
        foundUser.favSong.push(req.params.songId);
        foundUser.save();
        console.log('Added song to favSong');
    } else {
        console.log('Removed song from favSong');
    }
    const foundSong = await Song.findByIdAndUpdate(req.params.songId, {$pull: {favBy: req.user._id}}).exec();
    if(!foundSong.favBy.includes(req.user._id)) {
        foundSong.favBy.push(req.user._id);
        foundSong.save();
        console.log('Added user to favBy');
    } else {
        console.log('Removed user from favBy');
    }
    res.json('Done');
});

//add song in playlist
router.get('/updatePlaylist/:songId/:playlistId', function(req, res){
    Playlist.findByIdAndUpdate(req.params.playlistId, {$push: {song: req.params.songId}}, function(err, updatedPlaylist){
        if(err) {
            console.log(err);
        } else {
            console.log('Added song to playlist');
            res.json('Added');
        }
    });
});

//remove song from playlist
router.get('/removeSongFromPlaylist/:songId/:playlistId', function(req, res){
    Playlist.findByIdAndUpdate(req.params.playlistId, {$pull: {song: req.params.songId}}, function(err, updatedPlaylist){
        if(err) {
            console.log(err);
        } else {
            console.log('Removed song from playlist');
            res.json('Removed');
        }
    });
});

//return song
router.get('/player/song/:songId', function(req, res){
    Song.find({_id: req.params.songId})
    .populate({
        path: 'artist',
        model: 'Artist',
        select: '_id artistName'
    })
    .exec(function(err, foundSong){
        if(err) {
            console.log(err);
        } else {
            console.log('Song: ' + foundSong);
            res.json(foundSong);
        }
    });
});

//return song in album
router.get('/player/album/:albumId', function(req, res){
    Album.findById(req.params.albumId)
    .populate({
        path: 'song',
        model: 'Song',
        select: '_id songName songImg songFile',
        populate: {
            path: 'artist',
            model: 'Artist',
            select: '_id artistName'
        }
    })
    .exec(function(err, foundAlbum){
        if(err) {
            console.log(err);
        } else {
            console.log('Album: ' + foundAlbum);
            if(foundAlbum.song.length == 0) {
                res.json(null);
            } else {
                res.json(foundAlbum.song);
            }
        }
    });
});

//return song in playlist
router.get('/player/playlist/:playlistId', function(req, res){
    Playlist.findById(req.params.playlistId)
    .populate({
        path: 'song', 
        model: 'Song',
        select: '_id songName songImg songFile',
        populate: {
            path: 'artist', 
            select: '_id artistName', 
            model: 'Artist',
        }
    })
    .exec(function(err, foundPlaylist){
        if(err) {
            console.log(err);   
        } else {
            console.log('Playlist: ' + foundPlaylist);
            if(foundPlaylist.song.length == 0) {
                res.json(null);
            } else {
                res.json(foundPlaylist.song);
            }
        }
    }) 
});

module.exports = router;