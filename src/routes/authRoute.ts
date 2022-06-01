import { compare, genSalt, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";
import * as passport from "passport";
import { getCustomRepository, getRepository, MoreThan } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { USER_TOKEN_TYPES } from "../consts/USER_TOKEN_TYPES";
import { UserToken } from "../entities/OAuthToken";
import { User } from "../entities/User";
import { UserPreference } from "../entities/UserPreference";
import { DotEnvKeys } from "../enums/DotEnvKeys";
import { AuthChangePasswordPostDto } from "../interfaces/dtos/auth/AuthChangePasswordPostDto";
import { AuthUserGetDto } from "../interfaces/dtos/auth/AuthUserGetDto";
import { PasswordResetPostDto } from "../interfaces/dtos/auth/PasswordResetPostDto";
import { UserDeleteDto } from "../interfaces/dtos/auth/UserDeleteDto";
import { UsernamePutDto } from "../interfaces/dtos/auth/UsernamePutDto";
import { UserTokenPostDto } from "../interfaces/dtos/auth/UserTokenPostDto";
import authMiddleware from "../middlewares/authMiddleware";
import UserRepository from "../repositories/UserRepository";
import { MyErrorsResponse } from "../utils/ErrorMessage";
import { MyAuthRequest } from "../utils/MyAuthRequest";
import { myConsoleError } from "../utils/myConsoleError";
import { addMinutes } from "../utils/time/addMinutes";
import validateUserFields from "../utils/validateUser";

require("../utils/passport-setup");
require("dotenv").config();

const authRoute = Router();

//
// PE 2/3
authRoute.post("/register", async (req: MyAuthRequest, res) => {
  try {
    const userRepo = getCustomRepository(UserRepository);

    const sentUser = userRepo.create({ ...(req.body as User) });
    const userErrors = validateUserFields(sentUser);
    if (userErrors.length) {
      return res.status(400).json(new MyErrorsResponse().addErrors(userErrors));
    }

    // Checking if email exists
    let userExists = await userRepo.findOne({ email: sentUser.email });
    if (userExists) {
      return res
        .status(400)
        .json(new MyErrorsResponse("Email already in use", "email"));
    }

    // Checking if username exists
    userExists = await userRepo.findOne({ username: sentUser.username });
    if (userExists) {
      return res
        .status(400)
        .json(new MyErrorsResponse("Username already in use", "username"));
    }

    // Checking if username is valid
    const regex = new RegExp(/^[a-zA-Z0-9]+$/);
    if (!regex.test(sentUser.username)) {
      return res
        .status(400)
        .json(
          new MyErrorsResponse(
            "Invalid characters for username. Only use letters and numbers."
          )
        );
    }

    // bcrypt user password
    const salt = await genSalt(10);
    sentUser.password = await hash(sentUser.password, salt);

    const savedUser = await getCustomRepository(
      UserRepository
    ).saveAndGetRelations(sentUser);
    //  = await userRepo.save(sentUser)

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365));
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;

    sign(
      { userId: savedUser.id },
      process.env[DotEnvKeys.JWT_SECRET],
      { expiresIn: ONE_YEAR_IN_SECONDS },
      (err, token) => {
        if (err) throw err;
        return res.json(new AuthUserGetDto(savedUser, token, expireDate));
      }
    );
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

// PE 2/3 - do some small easy improvements
authRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body as User;
    body.username = body.email; // We just use email here, but we don't want to validate empty username

    const fieldErrors = validateUserFields(body);
    if (fieldErrors.length) {
      return res
        .status(400)
        .json(new MyErrorsResponse().addErrors(fieldErrors));
    }

    let userRepo = getCustomRepository(UserRepository);

    // username or email exists ?
    let user = await userRepo.findOne({
      where: [{ email: body.email }, { username: body.email }],
    });
    if (!user) {
      return res
        .status(400)
        .json(new MyErrorsResponse("Invalid email or username"));
    }

    // password is ok ?
    const passwordOk = await compare(body.password, user.password);
    if (!passwordOk) {
      return res
        .status(400)
        .json(new MyErrorsResponse("Invalid password", "password"));
    }

    // Signing in and returning  user's token
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365));
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;

    sign(
      { userId: user.id },
      process.env[DotEnvKeys.JWT_SECRET],
      { expiresIn: ONE_YEAR_IN_SECONDS },
      (err, token) => {
        if (err) throw err;
        return res.json(new AuthUserGetDto(user, token, expireDate));
      }
    );
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

// Get user info by sending a JWT on the request header
authRoute.get("/me", authMiddleware, async ({ user }: MyAuthRequest, res) => {
  try {
    // await sleep(2500)
    return res.json(new AuthUserGetDto(user, null, null));
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

// PE 3/3
// Redirects to google auth page
authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// PE 2/3
// After successful authentication at google page...
authRoute.get(
  "/google/callback",
  passport.authenticate("google"),
  async function (req, res) {
    const tokenRepo = getRepository(UserToken);
    try {
      const user = req.user as User;
      const oauthToken = await tokenRepo.save({
        userId: user.id,
        type: USER_TOKEN_TYPES.googleOauth,
        token: randomBytes(64).toString("hex"),
        expiresAt: addMinutes(new Date(), 15).toISOString(),
      });

      res.redirect(
        process.env.CLIENT_BASE_URL +
          "?oauthToken=" +
          oauthToken.token +
          "&userId=" +
          oauthToken.userId
      );
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

// PE 2/3
// The front-end uses the token and userId in the URL to finish the login
authRoute.post("/google/login", async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.body as UserTokenPostDto;
    const oauthRepo = getRepository(UserToken);

    const tokenExists = await oauthRepo.findOne({
      userId,
      token,
      expiresAt: MoreThan(new Date().toISOString()),
    });

    if (!tokenExists) {
      return res.status(400).json(new MyErrorsResponse("No OAuthToken found"));
    }

    // Same process as POST /auth/login
    const userRepo = getCustomRepository(UserRepository);

    const user = await userRepo.findOne({ id: userId });

    const expireDate = new Date(new Date().setDate(new Date().getDate() + 365));
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;

    req.logout();
    await oauthRepo.delete({
      userId: user.id,
      type: USER_TOKEN_TYPES.googleOauth,
    });

    sign(
      { userId: user.id },
      process.env[DotEnvKeys.JWT_SECRET],
      { expiresIn: ONE_YEAR_IN_SECONDS },
      (err, token) => {
        if (err) throw err;
        return res.json(new AuthUserGetDto(user, token, expireDate));
      }
    );
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

// --------- password reset
authRoute.post("/password-reset", async (req: MyAuthRequest, res) => {
  try {
    const { password, token, userId } = req.body as PasswordResetPostDto;
    const tokenRepo = getRepository(UserToken);

    // Token exists?
    const tokenExists = await tokenRepo.findOne({
      userId,
      token,
      type: USER_TOKEN_TYPES.passwordReset,
      expiresAt: MoreThan(new Date().toISOString()),
    });

    // se existe, faz a alteração de senha
    if (tokenExists) {
      const userRepo = getCustomRepository(UserRepository);
      const user = await userRepo.findOne({ id: userId });

      const salt = await genSalt(10);
      user.password = await hash(password, salt);

      await userRepo.save(user);
      await tokenRepo.delete({ userId, type: USER_TOKEN_TYPES.passwordReset });

      res.status(200).send();
    }

    return res
      .status(400)
      .json(new MyErrorsResponse("Token doesn't exists or is expired."));
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

authRoute.post(
  "/authenticated-password-change",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body as AuthChangePasswordPostDto;
      const user = req.user;

      const passwordOk = await compare(oldPassword, user.password);
      if (passwordOk) {
        const userRepo = getCustomRepository(UserRepository);

        const salt = await genSalt(10);
        const newPasswordHashed = await hash(newPassword, salt);
        user.password = newPasswordHashed;
        await userRepo.save(user);

        res.status(200).send();
      }

      return res.status(400).json(new MyErrorsResponse("Incorrect password"));
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

authRoute.delete("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const { password } = req.body as UserDeleteDto;
    // const { oldPassword, newPassword } = req.body as AuthChangePasswordPostDto
    const user = req.user;

    const passwordOk = await compare(password, user.password);
    if (passwordOk) {
      const userRepo = getCustomRepository(UserRepository);

      const deleted = await userRepo.delete({ id: user.id });

      return res.status(200).send();
    }

    return res.status(400).json(new MyErrorsResponse("Incorrect password"));
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

authRoute.put("/username", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const { newUsername } = req.body as UsernamePutDto;
    const { user } = req;

    const userRepo = getCustomRepository(UserRepository);
    const usernameExists = await userRepo.findOne({ username: newUsername });

    if (usernameExists) {
      return res
        .status(400)
        .json(new MyErrorsResponse("Username already in use."));
    }

    // Checking if username is valid
    const regex = new RegExp(/^[a-zA-Z0-9]+$/);
    if (!regex.test(newUsername)) {
      return res
        .status(400)
        .json(
          new MyErrorsResponse(
            "Invalid characters for username. Only use letters and numbers."
          )
        );
    }

    user.username = newUsername;
    await userRepo.save(user);

    return res.status(200).send();
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

// ========= TEMPORARY USER
// PE 2/3 - do some small easy improvements
authRoute.get("/temp-user", async (req: Request, res: Response) => {
  try {
    const userRepo = getCustomRepository(UserRepository);

    const username = uuidv4();
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 1));

    const user = await userRepo.save({
      username: username,
      email: username + "@" + username + ".com",
      password: username,
      expiresAt: expireDate.toISOString(),
    });

    // Signing in and returning  user's token
    const ONE_DAY_IN_SECONDS = 3600 * 24;

    sign(
      { userId: user.id },
      process.env[DotEnvKeys.JWT_SECRET],
      { expiresIn: ONE_DAY_IN_SECONDS },
      (err, token) => {
        if (err) throw err;
        return res.json(new AuthUserGetDto(user, token, expireDate));
      }
    );
  } catch (err) {
    myConsoleError(err.message);
    return res.status(400).json(new MyErrorsResponse(err.message));
  }
});

// talvez adicionar uma rota /user-preference ao invés de /auth/user-preference ?
authRoute.get(
  "/user-preference",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const { user } = req;

      const preferenceRepo = getRepository(UserPreference);
      const found = await preferenceRepo.findOne({ user: user });

      return res.status(200).json(found);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

authRoute.post(
  "/user-preference",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const { user } = req;
      const preference = req.body as UserPreference;
      preference.user = user;

      const preferenceRepo = getRepository(UserPreference);
      const saved = await preferenceRepo.save(preference);

      return res.status(200).json(saved);
    } catch (err) {
      myConsoleError(err.message);
      return res.status(400).json(new MyErrorsResponse(err.message));
    }
  }
);

export default authRoute;
