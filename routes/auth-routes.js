const router = require('express').Router();
const passport = require('passport')

router.get('/login', (request, response) => {
    response.render('login');
});

router.get('/logout', (request, response) => {
    // passport ~
    response.send("logging out");
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

module.exports = router;