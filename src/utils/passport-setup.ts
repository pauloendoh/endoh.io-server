import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { compare, genSalt, hash } from 'bcrypt';
import { randomBytes } from 'crypto';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

passport.serializeUser(function (user, done) {
  /*
  From the user take just the id (to minimize the cookie size) and just pass the id of the user
  to the done callback
  PS: You dont have to do it like this its just usually done like this
  */
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  /*
  Instead of user this function usually recives the id 
  then you use the id to select the user from the db and pass the user obj to the done callback
  PS: You can later access this data in any routes in: req.user
  */
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.SERVER_BASE_URL + "/auth/google/callback"
},
  async function (accessToken, refreshToken, profile, done) {
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */

    // find current user 
    const userRepo = getCustomRepository(UserRepository)
    const currentUser = await userRepo.findOne({
      googleId: profile.id
    });

    // TODO: what if google email is already registered?


    // create new user if the database doesn't have this user
    if (!currentUser) {
      const email = profile.emails[0].value
      const userWithEmail = await userRepo.findOne({ email })
      if (userWithEmail) {
        userWithEmail.googleId = profile.id
        await userRepo.save(userWithEmail)
        return done(null, userWithEmail)
      }

      const username = await userRepo.getAvailableUsername(email)
      const salt = await genSalt(10)
      const randomString = randomBytes(64).toString('hex')

      const newUser = await userRepo.save({
        googleId: profile.id,
        username,
        email,
        password: await hash(randomString, salt)
      })


      if (newUser) {
        return done(null, newUser);
      }
    }
    return done(null, currentUser);

  }
));