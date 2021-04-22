"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const typeorm_1 = require("typeorm");
const UserRepository_1 = require("../repositories/UserRepository");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
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
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        // find current user 
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const currentUser = yield userRepo.findOne({
            googleId: profile.id
        });
        // TODO: what if google email is already registered?
        // create new user if the database doesn't have this user
        if (!currentUser) {
            const email = profile.emails[0].value;
            const userWithEmail = yield userRepo.findOne({ email });
            if (userWithEmail) {
                userWithEmail.googleId = profile.id;
                yield userRepo.save(userWithEmail);
                return done(null, userWithEmail);
            }
            const username = yield userRepo.getAvailableUsernameByEmail(email);
            const salt = yield bcrypt_1.genSalt(10);
            const randomString = crypto_1.randomBytes(64).toString('hex');
            const newUser = yield userRepo.save({
                googleId: profile.id,
                username,
                email,
                password: yield bcrypt_1.hash(randomString, salt)
            });
            yield userRepo.save(newUser);
            return done(null, newUser);
        }
        return done(null, currentUser);
    });
}));
//# sourceMappingURL=passport-setup.js.map