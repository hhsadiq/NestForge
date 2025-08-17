import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClapTable1734330694427 implements MigrationInterface {
  name = 'CreateClapTable1734330694427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_040f24995f2f6cd7a2f59fdee14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_d5c3d184c36cfdf6da5a98ed3eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_9470701b13d0f33a3b97e25f075"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" DROP CONSTRAINT "FK_54e7da6bc2b01e3b2cb216ef55a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" DROP CONSTRAINT "FK_6dfc7f0345a5b3e68bcd6a1f79b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_16f0c3e4a6e4b9098b4cb9d92b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_ead4edb7c12b1d5b6b2c890afed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "FK_b455adfe6c9e38ae06d7e4c2b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "FK_aea99dfb23c6d5fce7cb9677c90"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" DROP CONSTRAINT "UQ_user_favorite_article_user_article"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "UQ_follow_follower_following"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "UQ_article_tag_article_tag"`,
    );
    await queryRunner.query(
      `CREATE TABLE "claps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "counter" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "article_id" uuid, CONSTRAINT "PK_9e484b4817bc4eec0318aea489c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "PK_9f26b2f0c4d4f37e1a3b97867d3"`,
    );
    await queryRunner.query(`ALTER TABLE "article_tag" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD "clap_count" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "PK_82061ea91c181fc708715430361" PRIMARY KEY ("article_id", "tag_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "body" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "author_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ALTER COLUMN "article_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ALTER COLUMN "follower_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ALTER COLUMN "following_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0cd76a8cdee62eeff31d384b73" ON "user" ("social_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a4fd2a547828e5efe420e50d1" ON "user" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6937e802be2946855a3ad0e6be" ON "user" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30e98e8746699fb9af235410af" ON "session" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26455b396109a0b535ddb61483" ON "article_tag" ("article_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdc3f155737b763c298ab080f8" ON "article_tag" ("tag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_03a590c26b0910b0bb49682b1e3" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "claps" ADD CONSTRAINT "FK_aa1d9297b1b505ed10aa402010d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "claps" ADD CONSTRAINT "FK_c1b8f513695ec0f3745dca74c05" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_16d4ce4c84bd9b8562c6f396262" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ADD CONSTRAINT "FK_efaaca104bc9ccc1d71b3f886f0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ADD CONSTRAINT "FK_223cb1bb8617c730a312b83a477" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_2863d588f4efce8bf42c9c63526" FOREIGN KEY ("photo_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_892a2061d6a04a7e2efe4c26d6f" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_e65ef3268d3d5589f94b09c2373" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_7e66760f06ef2ca5eb43109d1cc" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "FK_26455b396109a0b535ddb614832" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "FK_cdc3f155737b763c298ab080f84" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "FK_cdc3f155737b763c298ab080f84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "FK_26455b396109a0b535ddb614832"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_7e66760f06ef2ca5eb43109d1cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_e65ef3268d3d5589f94b09c2373"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_892a2061d6a04a7e2efe4c26d6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_2863d588f4efce8bf42c9c63526"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" DROP CONSTRAINT "FK_223cb1bb8617c730a312b83a477"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" DROP CONSTRAINT "FK_efaaca104bc9ccc1d71b3f886f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_16d4ce4c84bd9b8562c6f396262"`,
    );
    await queryRunner.query(
      `ALTER TABLE "claps" DROP CONSTRAINT "FK_c1b8f513695ec0f3745dca74c05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "claps" DROP CONSTRAINT "FK_aa1d9297b1b505ed10aa402010d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_03a590c26b0910b0bb49682b1e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdc3f155737b763c298ab080f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_26455b396109a0b535ddb61483"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_30e98e8746699fb9af235410af"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6937e802be2946855a3ad0e6be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a4fd2a547828e5efe420e50d1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0cd76a8cdee62eeff31d384b73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ALTER COLUMN "following_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ALTER COLUMN "follower_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ALTER COLUMN "article_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "author_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "body" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" DROP CONSTRAINT "PK_82061ea91c181fc708715430361"`,
    );
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "clap_count"`);
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "PK_9f26b2f0c4d4f37e1a3b97867d3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`DROP TABLE "claps"`);
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "UQ_article_tag_article_tag" UNIQUE ("article_id", "tag_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "UQ_follow_follower_following" UNIQUE ("follower_id", "following_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ADD CONSTRAINT "UQ_user_favorite_article_user_article" UNIQUE ("user_id", "article_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("last_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("first_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("social_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "FK_aea99dfb23c6d5fce7cb9677c90" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tag" ADD CONSTRAINT "FK_b455adfe6c9e38ae06d7e4c2b84" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_ead4edb7c12b1d5b6b2c890afed" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_16f0c3e4a6e4b9098b4cb9d92b8" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photo_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ADD CONSTRAINT "FK_6dfc7f0345a5b3e68bcd6a1f79b" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_article" ADD CONSTRAINT "FK_54e7da6bc2b01e3b2cb216ef55a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_9470701b13d0f33a3b97e25f075" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_d5c3d184c36cfdf6da5a98ed3eb" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_040f24995f2f6cd7a2f59fdee14" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
