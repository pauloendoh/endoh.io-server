import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1607911728358 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}