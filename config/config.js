var env = process.env.NODE_ENV || 'development';
var keys;

if (env == 'development' || env == 'test') {
    var config = require('./config.json');
    var keys = config[env];
}

module.exports = keys;
