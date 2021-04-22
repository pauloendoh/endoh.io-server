import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1608118214653 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
