import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1610376135091 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
