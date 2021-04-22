"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const passport = require("passport");
const typeorm_1 = require("typeorm");
const USER_TOKEN_TYPES_1 = require("../consts/USER_TOKEN_TYPES");
const OAuthToken_1 = require("../entities/OAuthToken");
const UserPreference_1 = require("../entities/UserPreference");
const DotEnvKeys_1 = require("../enums/DotEnvKeys");
const AuthUserGetDto_1 = require("../interfaces/dtos/auth/AuthUserGetDto");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const UserRepository_1 = require("../repositories/UserRepository");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const myConsoleError_1 = require("../utils/myConsoleError");
const addMinutes_1 = require("../utils/time/addMinutes");
const validateUser_1 = require("../utils/validateUser");
require('../utils/passport-setup');
require('dotenv').config();
const authRoute = express_1.Router();
// PE 2/3
authRoute.post('/register', async (req, res) => {
    try {
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const sentUser = userRepo.create({ ...req.body });
        const userErrors = validateUser_1.default(sentUser);
        if (userErrors.length) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse().addErrors(userErrors));
        }
        // Checking if email exists 
        let userExists = await userRepo.findOne({ email: sentUser.email });
        if (userExists) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Email already in use', 'email'));
        }
        // Checking if username exists
        userExists = await userRepo.findOne({ username: sentUser.username });
        if (userExists) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Username already in use', 'username'));
        }
        // Checking if username is valid
        const regex = new RegExp(/^[a-zA-Z0-9]+$/);
        if (!regex.test(sentUser.username)) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid characters for username. Only use letters and numbers.'));
        }
        // bcrypt user password
        const salt = await bcrypt_1.genSalt(10);
        sentUser.password = await bcrypt_1.hash(sentUser.password, salt);
        const savedUser = await typeorm_1.getCustomRepository(UserRepository_1.default)
            .saveAndGetRelations(sentUser);
        //  = await userRepo.save(sentUser)
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 365));
        const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;
        jsonwebtoken_1.sign({ userId: savedUser.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_YEAR_IN_SECONDS }, (err, token) => {
            if (err)
                throw err;
            return res.json(new AuthUserGetDto_1.AuthUserGetDto(savedUser, token, expireDate));
        });
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// PE 2/3 - do some small easy improvements 
authRoute.post('/login', async (req, res) => {
    try {
        const body = req.body;
        body.username = body.email; // We just use email here, but we don't want to validate empty username 
        const fieldErrors = validateUser_1.default(body);
        if (fieldErrors.length) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse().addErrors(fieldErrors));
        }
        let userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        // username or email exists ?
        let user = await userRepo.findOne({
            where: [
                { email: body.email },
                { username: body.email }
            ]
        });
        if (!user) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid email or username'));
        }
        // password is ok ?
        const passwordOk = await bcrypt_1.compare(body.password, user.password);
        if (!passwordOk) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid password', 'password'));
        }
        // Signing in and returning  user's token 
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 365));
        const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;
        jsonwebtoken_1.sign({ userId: user.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_YEAR_IN_SECONDS }, (err, token) => {
            if (err)
                throw err;
            return res.json(new AuthUserGetDto_1.AuthUserGetDto(user, token, expireDate));
        });
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// PE 3/3
// Redirects to google auth page 
authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// PE 2/3 
// After successful authentication at google page...
authRoute.get('/google/callback', passport.authenticate('google'), async function (req, res) {
    const tokenRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
    try {
        const user = req.user;
        const oauthToken = await tokenRepo.save({
            userId: user.id,
            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.googleOauth,
            token: crypto_1.randomBytes(64).toString('hex'),
            expiresAt: addMinutes_1.addMinutes(new Date(), 15).toISOString()
        });
        res.redirect(process.env.CLIENT_BASE_URL + "?oauthToken=" + oauthToken.token + "&userId=" + oauthToken.userId);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// PE 2/3 
// The front-end uses the token and userId in the URL to finish the login 
authRoute.post('/google/login', async (req, res) => {
    try {
        const { userId, token } = req.body;
        const oauthRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
        const tokenExists = await oauthRepo.findOne({
            userId,
            token,
            expiresAt: typeorm_1.MoreThan(new Date().toISOString())
        });
        if (!tokenExists) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("No OAuthToken found"));
        }
        // Same process as POST /auth/login
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const user = await userRepo.findOne({ id: userId });
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 365));
        const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;
        req.logout();
        await oauthRepo.delete({ userId: user.id, type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.googleOauth });
        jsonwebtoken_1.sign({ userId: user.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_YEAR_IN_SECONDS }, (err, token) => {
            if (err)
                throw err;
            return res.json(new AuthUserGetDto_1.AuthUserGetDto(user, token, expireDate));
        });
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// --------- password reset 
authRoute.post('/password-reset', async (req, res) => {
    try {
        const { password, token, userId } = req.body;
        const tokenRepo = typeorm_1.getRepository(OAuthToken_1.UserToken);
        // Token exists?
        const tokenExists = await tokenRepo.findOne({
            userId,
            token,
            type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset,
            expiresAt: typeorm_1.MoreThan(new Date().toISOString())
        });
        // se existe, faz a alteração de senha 
        if (tokenExists) {
            const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
            const user = await userRepo.findOne({ id: userId });
            const salt = await bcrypt_1.genSalt(10);
            user.password = await bcrypt_1.hash(password, salt);
            await userRepo.save(user);
            await tokenRepo.delete({ userId, type: USER_TOKEN_TYPES_1.USER_TOKEN_TYPES.passwordReset });
            res.status(200).send();
        }
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Token doesn't exists or is expired."));
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
authRoute.post('/authenticated-password-change', authMiddleware_1.default, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        const passwordOk = await bcrypt_1.compare(oldPassword, user.password);
        if (passwordOk) {
            const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
            const salt = await bcrypt_1.genSalt(10);
            const newPasswordHashed = await bcrypt_1.hash(newPassword, salt);
            user.password = newPasswordHashed;
            await userRepo.save(user);
            res.status(200).send();
        }
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Incorrect password"));
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
authRoute.delete('/', authMiddleware_1.default, async (req, res) => {
    try {
        const { password } = req.body;
        // const { oldPassword, newPassword } = req.body as AuthChangePasswordPostDto
        const user = req.user;
        const passwordOk = await bcrypt_1.compare(password, user.password);
        if (passwordOk) {
            const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
            const deleted = await userRepo.delete({ id: user.id });
            return res.status(200).send();
        }
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Incorrect password"));
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
authRoute.put('/username', authMiddleware_1.default, async (req, res) => {
    try {
        const { newUsername } = req.body;
        const { user } = req;
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const usernameExists = await userRepo.findOne({ username: newUsername });
        if (usernameExists) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Username already in use."));
        }
        // Checking if username is valid
        const regex = new RegExp(/^[a-zA-Z0-9]+$/);
        if (!regex.test(newUsername)) {
            return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Invalid characters for username. Only use letters and numbers.'));
        }
        user.username = newUsername;
        await userRepo.save(user);
        return res.status(200).send();
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// ========= TEMPORARY USER 
// PE 2/3 - do some small easy improvements 
authRoute.get('/temp-user', async (req, res) => {
    try {
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const username = await userRepo.getAvailableTempUsername();
        const expireDate = new Date(new Date().setDate(new Date().getDate() + 1));
        const user = await userRepo.save({
            username: username,
            email: username + '@' + username + '.com',
            password: username,
            expiresAt: expireDate.toISOString(),
        });
        // Signing in and returning  user's token 
        const ONE_DAY_IN_SECONDS = 3600 * 24;
        jsonwebtoken_1.sign({ userId: user.id }, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], { expiresIn: ONE_DAY_IN_SECONDS }, (err, token) => {
            if (err)
                throw err;
            return res.json(new AuthUserGetDto_1.AuthUserGetDto(user, token, expireDate));
        });
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
// talvez adicionar uma rota /user-preference ao invés de /auth/user-preference ?  
authRoute.get('/user-preference', authMiddleware_1.default, async (req, res) => {
    try {
        const { user } = req;
        const preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
        const found = await preferenceRepo.findOne({ user: user });
        return res.status(200).json(found);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
authRoute.post('/user-preference', authMiddleware_1.default, async (req, res) => {
    try {
        const { user } = req;
        const preference = req.body;
        preference.user = user;
        const preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
        const saved = await preferenceRepo.save(preference);
        return res.status(200).json(saved);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = authRoute;
