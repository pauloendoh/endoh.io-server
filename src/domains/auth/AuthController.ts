import { sign } from "jsonwebtoken";

import { genSalt, hash } from "bcryptjs";

import {
  BadRequestError,
  Body,
  JsonController,
  Post,
} from "routing-controllers";
import { getCustomRepository } from "typeorm";
import { User } from "../../entities/User";
import { DotEnvKeys } from "../../enums/DotEnvKeys";
import { AuthUserGetDto } from "../../interfaces/dtos/auth/AuthUserGetDto";
import UserRepository from "../../repositories/UserRepository";
import validateUserFields from "../../utils/validateUser";

@JsonController()
export class AuthController {
  constructor(private userRepo = getCustomRepository(UserRepository)) {}

  @Post("/auth/register")
  async register(
    @Body()
    body: User
  ) {
    try {
      const userRepo = getCustomRepository(UserRepository);

      const sentUser = userRepo.create(body);
      const userErrors = validateUserFields(sentUser);
      if (userErrors.length) {
        throw new BadRequestError(userErrors[0].message);
      }

      // Checking if email exists
      let userExists = await userRepo.findOne({ email: sentUser.email });
      if (userExists) {
        throw new BadRequestError("Email already in use");
      }

      // Checking if username exists
      userExists = await userRepo.findOne({ username: sentUser.username });
      if (userExists) {
        throw new BadRequestError("Username already in use");
      }

      // Checking if username is valid
      const regex = new RegExp(/^[a-zA-Z0-9]+$/);
      if (!regex.test(sentUser.username)) {
        throw new BadRequestError(
          "Invalid characters for username. Only use letters and numbers."
        );
      }

      // bcrypt user password
      const salt = await genSalt(10);
      sentUser.password = await hash(sentUser.password, salt);

      const savedUser = await getCustomRepository(
        UserRepository
      ).saveAndGetRelations(sentUser);
      //  = await userRepo.save(sentUser)

      const expireDate = new Date(
        new Date().setDate(new Date().getDate() + 365)
      );
      const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;

      const promise = new Promise<AuthUserGetDto>((res, rej) => {
        sign(
          { userId: savedUser.id },
          process.env[DotEnvKeys.JWT_SECRET],
          { expiresIn: ONE_YEAR_IN_SECONDS },
          (err, token) => {
            if (err) throw err;
            res(new AuthUserGetDto(savedUser, token, expireDate));
          }
        );
      });

      return await promise;
    } catch (e) {
      throw e;
    }
  }
}
