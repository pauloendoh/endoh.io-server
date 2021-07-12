"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionSubscriber = void 0;
const typeorm_1 = require("typeorm");
const Decision_1 = require("../entities/BigDecisions/Decision");
const DecisionTable_1 = require("../entities/BigDecisions/DecisionTable");
const myConsoleError_1 = require("../utils/myConsoleError");
let DecisionSubscriber = class DecisionSubscriber {
    listenTo() {
        return Decision_1.Decision;
    }
    // Creates two default tables ("yes, no")
    async afterInsert(event) {
        try {
            const { entity } = event;
            const tableRepo = event.manager.getRepository(DecisionTable_1.DecisionTable);
            const table1 = await tableRepo.save({
                userId: entity.userId,
                decisionId: entity.id,
                title: "Yes"
            });
            const table2 = await tableRepo.save({
                userId: entity.userId,
                decisionId: entity.id,
                title: "No"
            });
            entity.tables = [table1, table2];
        }
        catch (e) {
            myConsoleError_1.myConsoleError(e.message);
        }
    }
};
DecisionSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], DecisionSubscriber);
exports.DecisionSubscriber = DecisionSubscriber;
