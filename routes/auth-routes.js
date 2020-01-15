const router = require('express').Router();

router.get('/login', (request, response) => {
    response.render('login');
});

router.get('/logout', (request, response) => {
    // passport ~
    response.send("logging out");
});

router.get('/google', (request, response) => {
    // passport ~
    response.send("google login");
});

module.exports = router;