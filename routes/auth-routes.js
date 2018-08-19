const router = require('express').Router();
const passport = require('passport');
require('../config/passport-setup');

// auth login
router.get('/login', (req, res)=> {
    res.render('login');
})

// auth logout
router.get('/logout', (req, res)=> {
    // handle with passport
    req.logout();
    // res.send('logging out');
    res.redirect('/');
});


// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/redirect/google', passport.authenticate('google'), (req, res)=> {
    res.redirect('/profile/');
});


// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_likes']
}));

// callback route for facebook to redirect to
// hand control to passport to use code to grab profile info
router.get('/redirect/facebook', passport.authenticate('facebook'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

module.exports = router;
