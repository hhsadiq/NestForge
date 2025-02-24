import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserDeviceTable1740135333152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_device" (
                "id" bigint GENERATED ALWAYS AS IDENTITY,
                "user_id" bigint NOT NULL,
                "device_id" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_user_device_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_user_device_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "UQ_user_device_id_user_id_unique" UNIQUE ("device_id", "user_id")
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP CONSTRAINT "FK_user_device_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "user_device"`);
  }
}
