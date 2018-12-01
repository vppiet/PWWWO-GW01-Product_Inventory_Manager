const router = require('express').Router(); 
const passport = require('passport');
var indexRouter = require('../routes/index');

// authorize login
router.get('/login', (req, res) => {
    res.render('login', {user: req.user}); 
}); 

//authorize logout 
router.get('logout', (req, res) => {
    // handle with passport
    req.logout();
    app.use('/', indexRouter);
});

//authorize with google 
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
})); 

//callback route for google to redirect to 
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile'); 
});

module.exports = router; 

/* Add in app.js: 

const authRoutes = require('./routes/auth-routes'); 
const profileRoutes = require('./routes/profile-routes'); 
const passportSetup = require('./config/passport-setup'); 
const keys = require('.config/keys'); 
const cookieSession = require('cookie-session'); 
const passport = require('passport'); 

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, 
    keys: [keys.session.cookieKey]
})); 

//initialize passport
app.use(passport.initialize()); 
app.use(passport.session()); 

//connect to mongodb
mongoose.connect(keys.mongodb.dbUri, () => {
    console.log('connected to mongodb); 
}); 

//set up routes (after view engine)
app.use('/auth', authRoutes); 
app.use('/profile', profileRoutes); 
*/