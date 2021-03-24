import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1610982266005 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
