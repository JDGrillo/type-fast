const router = require('express').Router();
const passport = require('passport')

router.get('/login', (request, response) => {
    response.render('login', {user: request.user});
});

router.get('/logout', (request, response) => {
    // passport ~
    request.logout();
    response.redirect('/')
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

router.get('/google/redirect', passport.authenticate('google'), (request, response) => {
    response.redirect('/profile/')
})

module.exports = router;