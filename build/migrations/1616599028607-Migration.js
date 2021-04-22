"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616599028607 = void 0;
class Migration1616599028607 {
    constructor() {
        this.name = 'Migration1616599028607';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "test" ("id" SERIAL NOT NULL, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "test"`);
    }
}
exports.Migration1616599028607 = Migration1616599028607;
