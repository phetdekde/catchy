const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        User = require('./models/user'),
        seedDB = require('./seed');

const   collectionRoutes = require('./routes/collections.js'),
        commentRoutes = require('./routes/comments.js'),
        indexRoutes = require('./routes/index.js');

mongoose.connect('mongodb://localhost/uCollectionV3', {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000, function(){ console.log('Server started'); }))
    .catch((err) => console.log(err));    

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
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
    next();
});

app.use('/', indexRoutes);
app.use('/collection', collectionRoutes);
app.use('/collection/:id/comment', commentRoutes);
