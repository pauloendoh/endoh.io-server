import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1607700631957 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}