import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1736774199257 implements MigrationInterface {
  name = 'Migration1736774199257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publication" RENAME COLUMN "author" TO "authorId"`,
    );
    await queryRunner.query(`ALTER TABLE "publication" DROP COLUMN "authorId"`);
    await queryRunner.query(`ALTER TABLE "publication" ADD "authorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "publication" ADD CONSTRAINT "FK_152fc564787a7fc0f5456ad7dff" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publication" DROP CONSTRAINT "FK_152fc564787a7fc0f5456ad7dff"`,
    );
    await queryRunner.query(`ALTER TABLE "publication" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "publication" ADD "authorId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication" RENAME COLUMN "authorId" TO "author"`,
    );
  }
}
