const router = require('express').Router();
const passport = require('passport')

router.get('/login', (request, response) => {
    response.render('login', {user: request.user});
});

router.get('/highscorepage', (request, response) => {
    response.render('highscorepage');
});

router.get('/logout', (request, response) => {
    request.logout();
    response.redirect('/')
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

router.get('/google/redirect', passport.authenticate('google'), (request, response) => {
    response.redirect('/play/')
})

module.exports = router;