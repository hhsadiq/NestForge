import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBiometricChallengeTable1740135516726
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "biometric_challenge" (
            "id" bigint GENERATED ALWAYS AS IDENTITY,
            "user_device_id" bigint NOT NULL,
            "challenge" character varying NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "expires_at" TIMESTAMP NOT NULL,
            CONSTRAINT "UQ_challenge" UNIQUE ("challenge"),
            CONSTRAINT "PK_biometric_challenge_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_biometric_challenge_user_device_id" FOREIGN KEY ("user_device_id") REFERENCES "user_device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "biometric_public_key" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "biometric_challenge" DROP CONSTRAINT "FK_biometric_challenge_user_device_id"`,
    );
    await queryRunner.query(`DROP TABLE "biometric_challenge"`);
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP COLUMN "biometric_public_key"`,
    );
  }
}
