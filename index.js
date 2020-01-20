const express = require("express");
const models = require('./models');
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require('./routes/auth-routes')
const playRoutes = require('./routes/play-routes')
const profileRoutes = require('./routes/profile-routes')
const passportSetup = require('./config/passport-setup')
const cookieSession = require('cookie-session')
const passport = require('passport')
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(cookieSession({
  maxAge: 12 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/play', playRoutes)

app.get('/', (request, response) =>{
  response.render('home', {
    user: request.user
  })
});

// app.get('/login', (request, response) =>{
//   response.render('login')
// });


// let pbkdf2 = require('pbkdf2');
// let salt = process.env.SALT_KEY;

// function encryptionPassword(password) {
//   let key = pbkdf2.pbkdf2Sync(
//     password, salt, 36000, 256, 'sha256'
//   );
//   let hash = key.toString('hex');

//   return hash;
// }

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

// passport.serializeUser(function (user, cb) {
//   cb(null, user.id);
// });

// passport.deserializeUser(function (id, cb) {
//   models.user.findOne({ where: { id: id } }).then(function (user) {
//     cb(null, user);
//   });
// });

// /* PASSPORT LOCAL AUTHENTICATION */

// const LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     models.user.findOne({
//       where: {
//         username: username
//       }
//     }).then(function (user) {
//       if (!user) {
//         return done(null, false);
//       }

//       if (user.password != encryptionPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     }).catch(function (err) {
//       return done(err);
//     });
//   }
// ));

// app.post('/',
//   passport.authenticate('local', { failureRedirect: '/error' }),
//   function(req, res) {
//     res.redirect('/success');
//   });


// app.post("/sign-up", function (req, response) {
//   models.user.create({ 
//     name: req.body.name, 
//     email: req.body.email,
//     password: encryptionPassword(req.body.password)
//   })
//     .then(function (user) {
//       response.send(user);
//     });
// });

app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + 
  process.env.PORT + ' app name = ');
})