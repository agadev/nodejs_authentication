const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../model/user');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat:timestamp},config.secret);
}

// user has already authenticated just give new tokens
exports.signin = function(req,res,next){
  res.json({token:tokenForUser(req.user)});
}

// authenticate using user name and password
exports.signup = function(req,res,next){
    //res.send({success :'true'});
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
       return res.status(422).send({error:'Email or password is missing'});
    }

    User.findOne({email:email}, function(err,existingUser){
      if(err) {
        next(err);
      }
      if(existingUser) {
         return res.status(422).send({error:'Email already exists'});
      }

      const user = new User({
        email: email,
        password : password
      });

      user.save( function(err){
          if(err) {
             return next(err);
          }
      });

     res.json({token:tokenForUser(user)});

    });
}
