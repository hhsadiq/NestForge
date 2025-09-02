import { MigrationInterface, QueryRunner } from 'typeorm';

import { USER_SUMMARY_VIEW } from '@src/views/infrastructure/persistence/view.consts';

export class CreateUserSummaryView1756810542779 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { name, expression } = USER_SUMMARY_VIEW;

    await queryRunner.query(`
            CREATE VIEW ${name} AS
            ${expression}
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW ${USER_SUMMARY_VIEW.name}`);
  }
}
