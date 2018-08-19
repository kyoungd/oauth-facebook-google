const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./config');
const User = require('../models/user');

// serialize user and encrypt into a cookie
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
});

// deserialize user and decrypt from a cookie
// id must match what was stored in the cookie.  passport.serializeUser()
passport.deserializeUser((id, done) => {
    User.findById(id).then((user)=> {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        callbackURL: keys.google.callbackURI,
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('called back in GoogleStrategy');
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser) {
                console.log('current user is ', currentUser);
                // done(error, data); -> calls serializeUser
                done(null, currentUser);
            }
            else {
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.image.url
                }).save()
                .then((newUser)=> {
                    console.log('User: ' + newUser);
                    // done(error, data) -> calls serializeUser
                    done(null, newUser);
                });
            }
        })
    }));
    
passport.use(
    new FacebookStrategy({
        // options for google strategy
        clientID: keys.facebook.appID,
        clientSecret: keys.facebook.appSecret,
        callbackURL: keys.facebook.callbackURI,
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('profile: ', profile);
            // check if user already exists in our own db
            let currentUser = await User.findOne({googleId: profile.id});
            if(currentUser){
                // already have this user
                done(null, currentUser);
            } else {
                // if not, create user in our db
                let newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile.photos[0].value
                });
                await newUser.save();
                done(null, newUser);
            }
        }
        catch (err) {
            done(err, false, err.message)
        }
    })
);
