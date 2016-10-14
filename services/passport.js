const passport = require('passport');
const config = require('../config');
const User = require('../model/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {usernameField:'email'};
const localLogin = new LocalStrategy(localOptions,function(email,password,done){
  // verify username and password & for correct call done
  // otherwise call done with false
  User.findOne({email:email},function(err,user){

     if(err) {
       return done(err);
     }
     if(!user) {
       return done(null,false);
     }

     // compare password since user is already found
     user.comparePassword(password,function(err,isMatch){
       if(err) {
         return done(err);
       }
       if(!isMatch) {
         return done(null,false);
       }
       return done(null,user);
     });

  });  // end of findOne

});  // end of localstrategy


// setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JwtStrategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload,done){

     // check whether userid exists in database then call done
     User.findById(payload.sub,function(err,user){
         if(err) {
           return done(err,false);
         }

         if(user) {
           return done(null,user);
         }
         // otherwise call done without userid
         else {
           return done(null,false);
         }

     });
});


// use JwtStrategy with passport
passport.use(jwtLogin);
passport.use(localLogin);
