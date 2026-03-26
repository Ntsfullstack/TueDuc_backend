"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCode1774291999999 = void 0;
class StudentCode1774291999999 {
    name = 'StudentCode1774291999999';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "students" ADD "student_code" character varying`);
        await queryRunner.query(`UPDATE "students"
       SET "student_code" = 'HS-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 6))
       WHERE "student_code" IS NULL`);
        await queryRunner.query(`ALTER TABLE "students" ALTER COLUMN "student_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "UQ_students_student_code" UNIQUE ("student_code")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "UQ_students_student_code"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "student_code"`);
    }
}
exports.StudentCode1774291999999 = StudentCode1774291999999;
//# sourceMappingURL=1774291999999-StudentCode.js.map