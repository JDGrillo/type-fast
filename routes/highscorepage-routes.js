const router = require('express').Router()

router.get('/', (request, response) => {
    response.render('highscorepage')
})

module.exports = router;