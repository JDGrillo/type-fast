const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const authRoutes = require('./routes/auth-routes')
const playRoutes = require('./routes/play-routes')
const profileRoutes = require('./routes/profile-routes')
const signupRoutes = require('./routes/signup-routes')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const models = require('./models');
require('dotenv').config();

const initializePassport = require('./config/local-passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/play', playRoutes)
app.use('/signup', signupRoutes)


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.username })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup.ejs')
})

app.post('/signup', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        models.user.create({ 
              username: req.body.username, 
              password: hashedPassword
            }).then(function (user) {
                    res.send(user);
                  });
        res.redirect('/login')
      } catch {
        res.redirect('/signup')
      }
    })

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)