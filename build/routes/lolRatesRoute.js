"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const LolRateRepository_1 = require("../repositories/LolRateRepository");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const myConsoleError_1 = require("../utils/myConsoleError");
const lolRatesRoute = express_1.Router();
const lolRateRepo = typeorm_1.getCustomRepository(LolRateRepository_1.default);
//  PE 2/3
lolRatesRoute.get("/", async (req, res) => {
    try {
        const connection = typeorm_1.getConnection();
        const rates = await lolRateRepo.getRates();
        const updatedAt = await lolRateRepo.getUpdatedAt();
        return res.json({ rates, updatedAt: updatedAt[0] });
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = lolRatesRoute;
