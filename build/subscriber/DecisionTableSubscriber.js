"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionTableSubscriber = void 0;
const typeorm_1 = require("typeorm");
const DecisionTable_1 = require("../entities/BigDecisions/DecisionTable");
const DecisionRepository_1 = require("../repositories/BigDecisions/DecisionRepository");
const myConsoleError_1 = require("../utils/myConsoleError");
let DecisionTableSubscriber = class DecisionTableSubscriber {
    listenTo() {
        return DecisionTable_1.DecisionTable;
    }
    async afterInsert(event) {
        try {
            const decisionRepo = event.manager.getCustomRepository(DecisionRepository_1.default);
            const decision = await decisionRepo.findOne({
                where: { id: event.entity.decisionId },
                relations: ["tables"],
            });
            // since it's an after insert, you gotta get all -1
            event.entity.index = decision.tables.length - 1;
            const thisRepo = event.manager.getRepository(DecisionTable_1.DecisionTable);
            await thisRepo.save(event.entity);
        }
        catch (e) {
            myConsoleError_1.myConsoleError(e.message);
        }
    }
};
DecisionTableSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], DecisionTableSubscriber);
exports.DecisionTableSubscriber = DecisionTableSubscriber;
