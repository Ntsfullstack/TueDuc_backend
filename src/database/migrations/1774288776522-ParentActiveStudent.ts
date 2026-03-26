import { MigrationInterface, QueryRunner } from 'typeorm';

export class ParentActiveStudent1774288776522 implements MigrationInterface {
  name = 'ParentActiveStudent1774288776522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "active_student_id" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "active_student_id"`,
    );
  }
}
