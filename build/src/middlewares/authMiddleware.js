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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const UserRepository_1 = require("../repositories/UserRepository");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const DotEnvKeys_1 = require("../enums/DotEnvKeys");
// PE 2/3 
function authMiddleware(req, res, next) {
    const authToken = req.header('x-auth-token');
    if (!authToken)
        return res.status(401).json(new ErrorMessage_1.MyErrorsResponse('No token, authorization denied! Sign in and try again.'));
    // Verify token
    try {
        jsonwebtoken_1.verify(authToken, process.env[DotEnvKeys_1.DotEnvKeys.JWT_SECRET], (error, decodedObj) => __awaiter(this, void 0, void 0, function* () {
            if (error) {
                return res.status(401).json({ msg: 'Token is not valid. Sign in and try again.' });
            }
            else {
                req.user = yield typeorm_1.getCustomRepository(UserRepository_1.default)
                    .findOne({ id: decodedObj['userId'] });
                next();
            }
        }));
    }
    catch (err) {
        res.status(500).json(new ErrorMessage_1.MyErrorsResponse('Server Error'));
    }
}
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map