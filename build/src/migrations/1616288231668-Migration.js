"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616288231668 = void 0;
class Migration1616288231668 {
    constructor() {
        this.name = 'Migration1616288231668';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "type" character varying NOT NULL DEFAULT '', "message" character varying NOT NULL DEFAULT '', "seen" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_1ced25315eb974b73391fb1c81" UNIQUE ("userId"), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }
}
exports.Migration1616288231668 = Migration1616288231668;
//# sourceMappingURL=1616288231668-Migration.js.map