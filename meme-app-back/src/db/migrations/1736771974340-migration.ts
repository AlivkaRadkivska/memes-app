import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1736771974340 implements MigrationInterface {
  name = 'Migration1736771974340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publication" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pictures" text array NOT NULL, "description" character varying NOT NULL, "author" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "is_banned" boolean NOT NULL DEFAULT false, "ban_reason" character varying, "ban_expires_at" TIMESTAMP, CONSTRAINT "PK_8aea8363d5213896a78d8365fab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying, "full_name" character varying, "role" character varying NOT NULL, "birthday" TIMESTAMP, "signature" character varying, "is_banned" boolean NOT NULL DEFAULT false, "ban_reason" character varying, "ban_expires_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "publication"`);
  }
}
