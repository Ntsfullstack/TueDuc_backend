import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentCode1774291999999 implements MigrationInterface {
  name = 'StudentCode1774291999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add nullable first to allow backfill
    await queryRunner.query(
      `ALTER TABLE "students" ADD "student_code" character varying`,
    );

    // Backfill existing students with a code derived from their UUID
    await queryRunner.query(
      `UPDATE "students"
       SET "student_code" = 'HS-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 6))
       WHERE "student_code" IS NULL`,
    );

    // Make it NOT NULL and UNIQUE
    await queryRunner.query(
      `ALTER TABLE "students" ALTER COLUMN "student_code" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "UQ_students_student_code" UNIQUE ("student_code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "UQ_students_student_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "student_code"`,
    );
  }
}
