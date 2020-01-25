const express = require("express");
const models = require('./models');
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require('./routes/auth-routes')
const playRoutes = require('./routes/play-routes')
const profileRoutes = require('./routes/profile-routes')
const signupRoutes = require('./routes/signup-routes')
const highscoresRoutes = require('./routes/highscorepage-routes')
const passportSetup = require('./config/passport-setup')
const Sequelize = require('sequelize')
const cookieSession = require('cookie-session')
const passport = require('passport')
const ejs = require('ejs')
require('dotenv').config();


const app = express();

app.locals.pickWord = function(data) {
  return data[Math.floor(Math.random() * 100)]
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"))
app.set('view engine', 'ejs');

app.use(cookieSession({
  maxAge: 12 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUnitialized: false
}
))

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/play', playRoutes)
app.use('/signup', signupRoutes)
app.use('/highscorepage', highscoresRoutes)

app.get('/', (request, response) => {
  response.render('home', {
    user: request.user
  })
});

app.post('/stats', (request, response) => {
    models.result.create({user_id:request.body.user_id, correct_words:request.body.correct_words, incorrect_words:request.body.incorrect_words, play_time:request.body.play_time}).then(function(result){
        console.log(result)
    })
    response.send(request.body)
})

app.post('/correctresults', (request, response) => {
    let correct = []
    models.result.findAll({where: {user_id: request.body.user_id}}).then((results) => {
        results.forEach(function(index){
            correct.push(index.correct_words)
            console.log(correct)
        })
        response.send(correct)
    })
})


app.post('/incorrectresults', (request, response) => {
  let incorrect = []
  models.result.findAll({where: {user_id: request.body.user_id}}).then((results) => {
      results.forEach(function(index){
          incorrect.push(index.incorrect_words)
          console.log(incorrect)
      })
      response.send(incorrect)
  })
})

app.get('/highscores', (request, response) => {
  models.sequelize.query('SELECT results.user_id, results.correct_words, users.username FROM results JOIN users on results.user_id = users.id ORDER BY correct_words DESC LIMIT 5').then((results) => {
    response.send(results[0])
  })
})


app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + 
  process.env.PORT)
})