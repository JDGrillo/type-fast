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
const initializePassport = require('./config/local-passport-config')
const Sequelize = require('sequelize')
const cookieSession = require('cookie-session')
const flash = require('express-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const scripts = require('./javascripts/play')
const ejs = require('ejs')
const fs = require('fs')
require('dotenv').config();
//require('./config/passport-setup')(passport)


const app = express();

app.locals.pickWord = function(data) {
  return data[Math.floor(Math.random() * 100)]
}

initializePassport(passport, 
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//app.use(express.static(__dirname + 'javascripts'))
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
  //models.sequelize.query('SELECT results.user_id, results.correct_words, user.username FROM results ORDER BY correct_words DESC LIMIT 5').then((results) => {
  models.sequelize.query('SELECT results.user_id, results.correct_words, users.username FROM results JOIN users on results.user_id = users.id ORDER BY correct_words DESC LIMIT 5').then((results) => {
    response.send(results[0])
  })
})

// app.get('/login', (request, response) =>{
//   response.render('login')
// });


let pbkdf2 = require('pbkdf2');
let salt = process.env.SALT_KEY;

function encryptionPassword(password) {
  let key = pbkdf2.pbkdf2Sync(
    password, salt, 36000, 256, 'sha256'
  );
  let hash = key.toString('hex');

  return hash;
}


// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         console.log(username)
//         models.user.findOne({
//             where: {
//                 username: username
//             }
//         }).then(function (user) {
//             if (!user) {
//                 return done(null, false);
//             }

//             if (user.password != encryptionPassword(password)) {
//                 return done(null, false);
//             }
//             return done(null, user);
//         }).catch(function (err) {
//             return done(err);
//         });
//     }
// ));

// app.use(session({
//   secret: process.env.SECRET, 
//   resave: false, 
//   saveUninitialized: true
// }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(__dirname + '/public'));

// /*  PASSPORT SETUP  */

// const passport = require('passport');
// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/success', function(req, res) {
//   if(req.isAuthenticated()) {
//     res.send("Welcome " + req.user.username + "!!");
//   } else {
//     res.send("not authorized.");
//   }
// });

// app.get('/logout', function(req, res) {
//   if(req.isAuthenticated()){
//     console.log("user logging out");
//     req.logOut();
//     res.send("user has logged out");
//   } else {
//     res.send("You don't have a session open");
//   }
// });

// app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  models.user.findOne({ where: { id: id } }).then(function (user) {
    cb(null, user);
  });
});

// /* PASSPORT LOCAL AUTHENTICATION */

// const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    models.user.findOne({
      where: {
        username: username
      }
    }).then(function (user) {
      if (!user) {
        return done(null, false);
      }

      if (user.password != encryptionPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    }).catch(function (err) {
      return done(err);
    });
  }
));

// app.post('/',
//   passport.authenticate('local', { failureRedirect: '/error' }),
//   function(req, res) {
//     res.redirect('/success');
//   });


// app.post("/signup", passport.authenticate('local', { failureRedirect: '/error' }),
// function (req, response) {
//   models.user.create({ 
//     username: req.body.username, 
//     password: encryptionPassword(req.body.password)
//   })
//     .then(function (user) {
//       response.send(user);
//     });
// });

app.post('/signup', async (req, res) => {
  //console.log(req.body)
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
    res.redirect('/bad')
  }
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

app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + 
  process.env.PORT + ' app name = ');
})
//passport.authenticate('local', { failureRedirect: '/didntwork'})

