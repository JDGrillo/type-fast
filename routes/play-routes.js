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
    let words = [
        'the',   'of',     'to',    'and',   'a',      'in',    'is',
        'it',    'you',    'that',  'he',    'was',    'for',   'on',
        'are',   'with',   'as',    'I',     'his',    'they',  'be',
        'at',    'one',    'have',  'this',  'from',   'or',    'had',
        'by',    'not',    'word',  'but',   'what',   'some',  'we',
        'can',   'out',    'other', 'were',  'all',    'there', 'when',
        'up',    'use',    'your',  'how',   'said',   'an',    'each',
        'she',   'which',  'do',    'their', 'time',   'if',    'will',
        'way',   'about',  'many',  'then',  'them',   'write', 'would',
        'like',  'so',     'these', 'her',   'long',   'make',  'thing',
        'see',   'him',    'two',   'has',   'look',   'more',  'day',
        'could', 'go',     'come',  'did',   'number', 'sound', 'no',
        'most',  'people', 'my',    'over',  'know',   'water', 'than',
        'call',  'first',  'who',   'may',   'down',   'side',  'been',
        'now',   'find']

    response.render('play', {
        user: request.user,
        data: words
    })
})

module.exports = router;