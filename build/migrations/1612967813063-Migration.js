"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1612967813063 = void 0;
class Migration1612967813063 {
    constructor() {
        this.name = 'Migration1612967813063';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL DEFAULT '', "bio" character varying NOT NULL DEFAULT '', "website" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }
}
exports.Migration1612967813063 = Migration1612967813063;
//# sourceMappingURL=1612967813063-Migration.js.map