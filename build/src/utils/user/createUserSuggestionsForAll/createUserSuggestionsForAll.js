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
exports.createUserSuggestionsForAll = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../../entities/User");
const myConsoleError_1 = require("../../myConsoleError");
const myConsoleSuccess_1 = require("../../myConsoleSuccess");
const createUserSuggestionsForUser_1 = require("./createUserSuggestionsForUser/createUserSuggestionsForUser");
const createUserSuggestionsForAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        myConsoleSuccess_1.myConsoleSuccess("running createUserSuggestionsForAll()");
        // for each user
        const allUsers = yield typeorm_1.getRepository(User_1.User).find();
        for (const user of allUsers) {
            createUserSuggestionsForUser_1.default(user);
        }
        myConsoleSuccess_1.myConsoleSuccess("success createUserSuggestionsForAll()");
    }
    catch (e) {
        myConsoleError_1.myConsoleError("error createUserSuggestionsForAll(): " + e.message);
    }
});
exports.createUserSuggestionsForAll = createUserSuggestionsForAll;
//# sourceMappingURL=createUserSuggestionsForAll.js.map