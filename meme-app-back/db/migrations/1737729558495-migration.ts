import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737729558495 implements MigrationInterface {
  name = 'Migration1737729558495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "publication_id" uuid, CONSTRAINT "UQ_e0af6752dca83f1d5e10e0e69ca" UNIQUE ("user_id", "publication_id"), CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" ADD CONSTRAINT "FK_4356ac2f9519c7404a2869f1691" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" ADD CONSTRAINT "FK_6d47f5d8f82d6a4c5be1b80e347" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "like" DROP CONSTRAINT "FK_6d47f5d8f82d6a4c5be1b80e347"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" DROP CONSTRAINT "FK_4356ac2f9519c7404a2869f1691"`,
    );
    await queryRunner.query(`DROP TABLE "like"`);
  }
}
