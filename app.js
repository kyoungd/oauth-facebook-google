const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const keys = require('./config/keys');
const app = express();
const bodyParser = require('body-parser');

// setup cookie session
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// setup view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodb.dbURI, ()=>{
    console.log('connected to mongo db at mLab....')
});


app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

app.listen(3000, ()=> {
    console.log('app started on port 3000...............');
});
