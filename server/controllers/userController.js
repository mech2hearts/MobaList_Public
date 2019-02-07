var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var bcrypt = require('bcrypt-nodejs')
const keys = require('../../config.js')
var jwt = require('jsonwebtoken')


//connect to database
mongoose.connect(keys.mlab)



//create Schema and Model
const signupSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  fgoJP: {
    gameName:{type: String},
    fgoIGN: {type: String},
    fgoFC: {type: String},
    fgoPrivate: {type: Boolean},
    fgoTC: {type: String},
    fgoPlayTime: {type: String}
  },
  bangDreamEN: {
    gameName:{type: String},
    bdIGN: {type: String},
    bdFC: {type: String},
    bdPrivate: {type: Boolean},
    bdTC: {type: String},
    bdPlayTime: {type: String}
  },
  deresute: {
    gameName:{type: String},
    cgIGN: {type: String},
    cgFC: {type: String},
    cgPrivate: {type: Boolean},
    cgTC: {type: String},
    cgPlayTime: {type: String}
  },
})

//Separate table keeping track of a user's session
const userSessions = new mongoose.Schema({
  username: {
    type: String
  },
  expDate: {
    type: Date
  }
})


//Passwords hashed during save process
signupSchema.pre('save', function (next) {
  var user = this;
  this.hashPassword(user.password, function (err, hash){
    if (err) {
      return next(err)
    }
    user.password = hash;
    next()
  })
})

signupSchema.methods.hashPassword = function (testPassword, cb) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return cb(err)
    }
    bcrypt.hash(testPassword, salt, null, function (err, hash) {
      if (err) {
        return cb(err)
      }
        return cb(null, hash)
    })
  })
}

//Password entered and password in DB compared to confirm authentication
signupSchema.methods.comparePassword = function (testPassword, hashPassword, cb) {
  bcrypt.compare(testPassword, hashPassword, function (err, isMatch){
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch)
  })
}


const Signups = mongoose.model('Signup', signupSchema)
const Sessions = mongoose.model('Sessions', userSessions)

module.exports = function(app){
  //user registration
  app.post('/signup', function(req, res){
    var newSignup = Signups(req.body).save(function(err, data){
      if (err) throw err;
      res.send(req.body)
    })
  })

  //user profile (dummy account provided for the meantime)
  app.get('/profile', function(req, res){
    Signups.findOne({username: 'Roto'}, function(err, data){
      if (err) throw err;
      res.send(data)
    })
  })

  //user login. On success the user is sent a JSON Web Token which is saved onto the user's local storage
  //The user is also saved to the sessions DB 
  app.post('/login', function(req, res){
    Signups.findOne({username: req.body.username}).then(function (user){
      if (!user) {
        res.send("incorrect")
      } else {
        bcrypt.compare(req.body.password, user.password, function (err, result)
        {
            if (result == true){
              var sess = new Sessions({username: req.body.username, expDate: Date.now() + (60 * 60 * 1000)})
              sess.save().then(item => {
                var token = jwt.sign({username: req.body.username, expDate: Date.now() + (60 * 60 * 1000) }, keys.jwtSecret)
                res.send(token)
              })
            } else {
              res.send('incorrect')
            }
        }
        )
      }
    })
  })

  //logout. User's JSON Web Token is decrypted to the user's info and is thus removed from the sessions DB
    app.post('/logout', function(req,res){
      if(req.body.token){
        var decoded = jwt.verify(req.body.token, keys.jwtSecret)
        Sessions.deleteOne({username: decoded.username}).then(function(token){
          if(token){
            res.send("logged out")
          }
          else{
            res.send('error')
          }
        })
      }
    })

  //authorization function for sessions
  app.post('/auth', function(req, res){
    if(req.body.token!=null){
      var decoded = jwt.verify(req.body.token, 'seckwet')
      Sessions.findOne({username: decoded.username}).then(function (user){
        if (!user){
          res.send('invalid')
        }
        else{
          if(Date.now() > user.expDate){
            Sessions.deleteOne({username: decoded.username}, function(err, obj){
              if (err) throw err;
              res.send("clear")
            })
          }
          else{
            res.send('valid')
          }
        }
      })
    }
  })
}
