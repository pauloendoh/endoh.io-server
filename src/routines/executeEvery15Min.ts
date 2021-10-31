import fetch from "node-fetch";
// Why did I import this for?
import "reflect-metadata";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";
import { myConsoleError } from "../utils/myConsoleError";
import { myConsoleSuccess } from "../utils/myConsoleSuccess";

const executeEvery15Min = async () => {
  setInterval(async () => {
    fetch("https://endohio-server.herokuapp.com/")
      .then((res) => res.json())
      .then((json) =>
        myConsoleSuccess("GET OK https://endohio-server.herokuapp.com/")
      );

    fetch("https://lolrates.vercel.app/")
      .then((res) => res.text())
      .then((text) => myConsoleSuccess("GET OK https://lolrates.vercel.app/"));

    try {
      const userRepo = getCustomRepository(UserRepository);

      const deleted = await userRepo.deleteExpiredTempUsers();
      myConsoleSuccess("Deleting expired temp users");
    } catch (e) {
      myConsoleError(e.message);
    }
  }, 60 * 1000 * 15);
};

export default executeEvery15Min;
