"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1618338869653 = void 0;
class Migration1618338869653 {
    constructor() {
        this.name = 'Migration1618338869653';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "lol_rate" ("id" SERIAL NOT NULL, "championName" character varying NOT NULL, "iconUrl" character varying NOT NULL, "opggPick" integer, "opggWin" integer, "opggAvg" integer, "opggUpdatedAt" character varying, "lolgraphsPick" integer, "lolgraphsWin" integer, "lolgraphsAvg" integer, "lolgraphsUpdatedAt" character varying, "lolalyticsPick" integer, "lolalyticsWin" integer, "lolalyticsAvg" integer, "lolalyticsUpdatedAt" character varying, "blitzPick" integer, "blitzWin" integer, "blitzAvg" integer, "blitzUpdatedAt" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a7f77bbbe8e8e88847946d3ed7" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "lol_rate"`);
    }
}
exports.Migration1618338869653 = Migration1618338869653;
//# sourceMappingURL=1618338869653-Migration.js.map