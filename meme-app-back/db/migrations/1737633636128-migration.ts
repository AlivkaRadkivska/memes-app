import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737633636128 implements MigrationInterface {
  name = 'Migration1737633636128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publication" DROP CONSTRAINT "FK_152fc564787a7fc0f5456ad7dff"`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "picture" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "publication_id" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "publication" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "publication" ADD "keywords" text array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication" ADD "last_updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "publication" ADD "author_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "publication" ADD CONSTRAINT "FK_e552eece487b7576e383387a32c" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_e76fc61accb571a4755817a27bd" FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_e76fc61accb571a4755817a27bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication" DROP CONSTRAINT "FK_e552eece487b7576e383387a32c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication" DROP COLUMN "author_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication" DROP COLUMN "last_updated_at"`,
    );
    await queryRunner.query(`ALTER TABLE "publication" DROP COLUMN "keywords"`);
    await queryRunner.query(`ALTER TABLE "publication" ADD "authorId" uuid`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `ALTER TABLE "publication" ADD CONSTRAINT "FK_152fc564787a7fc0f5456ad7dff" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
