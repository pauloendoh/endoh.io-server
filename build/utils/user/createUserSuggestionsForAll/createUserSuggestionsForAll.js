"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSuggestionsForAll = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../../entities/User");
const myConsoleError_1 = require("../../myConsoleError");
const myConsoleSuccess_1 = require("../../myConsoleSuccess");
const createUserSuggestionsForUser_1 = require("./createUserSuggestionsForUser/createUserSuggestionsForUser");
// PE 1/3 - deixar dentro do userSuggestionRepository
const createUserSuggestionsForAll = async () => {
    try {
        myConsoleSuccess_1.myConsoleSuccess("running createUserSuggestionsForAll()");
        // for each user
        const allUsers = await typeorm_1.getRepository(User_1.User).find();
        for (const user of allUsers) {
            createUserSuggestionsForUser_1.default(user);
        }
        myConsoleSuccess_1.myConsoleSuccess("success createUserSuggestionsForAll()");
    }
    catch (e) {
        myConsoleError_1.myConsoleError("error createUserSuggestionsForAll(): " + e.message);
    }
};
exports.createUserSuggestionsForAll = createUserSuggestionsForAll;
