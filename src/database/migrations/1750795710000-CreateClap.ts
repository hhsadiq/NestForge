import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClapTable1750795710000 implements MigrationInterface {
  name = 'CreateClapTable1750795710000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "clap" (
          "user_id" integer NOT NULL,
          "article_id" uuid NOT NULL,
          "id" uuid DEFAULT uuid_generate_v4(),
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_clap_user_article" PRIMARY KEY ("user_id","article_id")
        )
      `);

    await queryRunner.query(
      `ALTER TABLE "clap" 
          ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0eert" 
          FOREIGN KEY ("article_id") REFERENCES "article"("id") 
          ON DELETE NO ACTION 
          ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "clap" 
          ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92189" 
          FOREIGN KEY ("user_id") REFERENCES "user"("id") 
          ON DELETE NO ACTION 
          ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clap"`);
  }
}
