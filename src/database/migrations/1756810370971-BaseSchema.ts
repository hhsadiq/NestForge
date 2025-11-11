import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseSchema1756810370971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- role table ---
    await queryRunner.query(
      `CREATE TABLE "role" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_role_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_role_name" UNIQUE ("name")
      )`,
    );

    // --- status table ---
    await queryRunner.query(
      `CREATE TABLE "status" (
        "id" integer NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_status_id" PRIMARY KEY ("id")
      )`,
    );

    // --- file table ---
    await queryRunner.query(
      `CREATE TABLE "file" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY,
        "path" character varying NOT NULL,
        CONSTRAINT "PK_file_id" PRIMARY KEY ("id")
      )`,
    );

    // --- user table ---
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY,
        "email" character varying,
        "username" character varying,
        "password" character varying,
        "provider" character varying NOT NULL DEFAULT 'email',
        "social_id" character varying,
        "first_name" character varying,
        "last_name" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "photo_id" integer,
        "status_id" integer,
        CONSTRAINT "UQ_user_email_unique" UNIQUE ("email"),
        CONSTRAINT "UQ_user_username_unique" UNIQUE ("username"),
        CONSTRAINT "UQ_user_photo_id_unique" UNIQUE ("photo_id"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_photo_id" FOREIGN KEY ("photo_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_user_status_id" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_user_social_id" ON "user" ("social_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_first_name" ON "user" ("first_name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_last_name" ON "user" ("last_name")`,
    );

    // --- session table ---
    await queryRunner.query(
      `CREATE TABLE "session" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY,
        "hash" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" integer,
        CONSTRAINT "PK_session_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_session_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_session_user_id" ON "session" ("user_id")`,
    );

    // --- user_device table ---
    await queryRunner.query(
      `CREATE TABLE "user_device" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY,
        "user_id" integer NOT NULL,
        "device_id" character varying,
        "biometric_public_key" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_user_device_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_device_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "UQ_user_device_device_id_user_id_unique" UNIQUE ("device_id", "user_id")
      )`,
    );

    // --- biometric_challenge table ---
    await queryRunner.query(
      `CREATE TABLE "biometric_challenge" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY,
        "user_device_id" integer NOT NULL,
        "challenge" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "expires_at" TIMESTAMP NOT NULL,
        CONSTRAINT "UQ_biometric_challenge_challenge_unique" UNIQUE ("challenge"),
        CONSTRAINT "PK_biometric_challenge_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_biometric_challenge_user_device_id" FOREIGN KEY ("user_device_id") REFERENCES "user_device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );

    // --- action table ---
    await queryRunner.query(
      `CREATE TABLE "action" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_action_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_action_name" UNIQUE ("name")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "subject" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subject_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_subject_name" UNIQUE ("name")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" (
        "id" INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
        "subject_id" integer NOT NULL,
        "action_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_permission_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_permission_subject" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION,
        CONSTRAINT "FK_permission_action" FOREIGN KEY ("action_id") REFERENCES "action"("id") ON DELETE NO ACTION,
        CONSTRAINT "UQ_permission_action_subject" UNIQUE ("action_id", "subject_id")
      )`,
    );

    await queryRunner.query(`CREATE TABLE "user_role" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
      "user_id" INTEGER NOT NULL,
      "role_id" INTEGER NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_user_role" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_user_role_user_id_role_id" UNIQUE ("user_id", "role_id")
  )`);
    await queryRunner.query(`CREATE TABLE "role_permission" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,
      "role_id" INTEGER NOT NULL,
      "permission_id" INTEGER NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_role_permission" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_role_permission_role_id_permission_id" UNIQUE ("role_id", "permission_id")
  )`);
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_user_role_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_user_role_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_role_permission_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_role_permission_permission" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_role_permission_permission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_role_permission_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_user_role_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_user_role_user"`,
    );
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_permission_action"`,
    );
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "subject"`);
    await queryRunner.query(`DROP TABLE "action"`);

    await queryRunner.query(`DROP TABLE "biometric_challenge"`);
    await queryRunner.query(`DROP TABLE "user_device"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_session_user_id"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_last_name"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_first_name"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_social_id"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
