import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1735911329734 implements MigrationInterface {
  name = 'Migration1735911329734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "signature" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "signature" SET NOT NULL`,
    );
  }
}
