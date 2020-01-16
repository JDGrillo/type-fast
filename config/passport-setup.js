const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
require('dotenv').config();

passport.use(new GoogleStrategy({
    //options for strategy
    callbackURL:'/auth/google/redirect',
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET
}, () => {
    // passport callback
})
)