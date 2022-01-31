const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        flash = require('connect-flash'),
        methodOverride = require('method-override'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        User = require('./models/user'),
        seedDB = require('./seed');

const   homeRoutes = require('./routes/home.js'),
        userRoutes = require('./routes/users.js'),
        songRoutes = require('./routes/song.js'),
        artistRoutes = require('./routes/artist.js'),
        albumRoutes = require('./routes/album.js'),
        indexRoutes = require('./routes/index.js'),
        fetchRoutes = require('./routes/fetch.js'),
        databaseRoutes = require('./routes/database.js');

mongoose.connect('mongodb://localhost/catchy', {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000, function(){ console.log('Server started'); }))
    .catch((err) => console.log(err));    

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

app.use(require('express-session')({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', homeRoutes); // /, /register, /login, /logout
app.use('/fetch', fetchRoutes);
app.use('/', indexRoutes); // /home
app.use('/song', songRoutes); // /song
app.use('/artist', artistRoutes); // /artist
app.use('/album', albumRoutes); // /album
app.use('/user', userRoutes); // /user/:id
app.use('/fetch/database', databaseRoutes); // /fetch/database
