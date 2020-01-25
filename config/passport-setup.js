const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const LocalStrategy = require('passport-local').Strategy
const models = require('../models');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    models.user.findByPk(id).then((user) => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    //options for strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
    //does user exist?
    models.user.findOne({
        where: {
            googleID: profile.id
        }
    }).then((existingUser) => {
        if (existingUser) {
            console.log("user is found" + existingUser)
            done(null, existingUser)
        } else {
            models.user.create({
                username: profile.displayName,
                googleID: profile.id
            }).then((newUser) => {
                console.log('new user created' + newUser)
                done(null, newUser)
            })
        }
    })
})
)
