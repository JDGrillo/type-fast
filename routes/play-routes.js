const router = require('express').Router()
const pg = require('pg')
require('dotenv').config();

const authCheck = (request, response, next) => {
    if (!request.user) {
        response.redirect('/auth/login')
    } else {
        next()
    }
}

router.get('/', authCheck, (request, response) => {
    /*
    let connectionString = "postgres://" + process.env.RDS_USER + ":" + process.env.RDS_PWD + "@"  + process.env.RDS_HOST + ":5432/" + process.env.RDS_DB
    let pgClient = new pg.Client(connectionString)
    async function queryIt() {
        await pgClient.connect()
        let words = []
        let query = await pgClient.query("SELECT * FROM words")
        query.rows.forEach(row => {
            words.push(row.word)
    })
    return words
    //await pgClient.end()
    // return words
    }
    let queryResult =  
            queryIt().then(function(result) {
                console.log(result)
                return result
            
    })
    */

    response.render('play', {
        user: request.user
    })
})

module.exports = router;