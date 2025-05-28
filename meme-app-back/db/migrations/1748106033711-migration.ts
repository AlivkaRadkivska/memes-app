import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748106033711 implements MigrationInterface {
    name = 'Migration1748106033711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
