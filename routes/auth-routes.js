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

router.get('/google/redirect', passport.authenticate('google'), (request, response) => {
    response.send("callback URI")
})

module.exports = router;