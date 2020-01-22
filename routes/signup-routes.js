const router = require('express').Router()

router.get('/', (request, response) => {
    response.render('signup', {
        user: request.user
    })
})

module.exports = router;