import { MigrationInterface, QueryRunner } from 'typeorm';

export class AttendanceHomework1774288462435 implements MigrationInterface {
  name = 'AttendanceHomework1774288462435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "homework_targets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "homework_id" uuid NOT NULL, "student_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_54ecf77ed6edeaa922e70ad7551" UNIQUE ("homework_id", "student_id"), CONSTRAINT "PK_658cd5e372c36dc2f82402d7d9a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."homeworks_type_enum" AS ENUM('quiz', 'essay')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."homeworks_target_scope_enum" AS ENUM('class', 'students')`,
    );
    await queryRunner.query(
      `CREATE TABLE "homeworks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "type" "public"."homeworks_type_enum" NOT NULL, "due_at" TIMESTAMP WITH TIME ZONE, "class_id" uuid NOT NULL, "teacher_id" uuid NOT NULL, "target_scope" "public"."homeworks_target_scope_enum" NOT NULL DEFAULT 'class', "quiz" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b14704fd42638206031612722de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."homework_submissions_status_enum" AS ENUM('submitted', 'graded')`,
    );
    await queryRunner.query(
      `CREATE TABLE "homework_submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "homework_id" uuid NOT NULL, "student_id" uuid NOT NULL, "parent_id" uuid NOT NULL, "status" "public"."homework_submissions_status_enum" NOT NULL DEFAULT 'submitted', "quizAnswers" jsonb, "attachments" jsonb, "score" numeric(4,1), "feedback" text, "submitted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_800884d9982467982affb80427c" UNIQUE ("homework_id", "student_id"), CONSTRAINT "PK_4c570ffb4ce1a34b63afa9d1b26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attendance_records_status_enum" AS ENUM('present', 'absent', 'late', 'excused')`,
    );
    await queryRunner.query(
      `CREATE TABLE "attendance_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_id" uuid NOT NULL, "student_id" uuid NOT NULL, "status" "public"."attendance_records_status_enum" NOT NULL DEFAULT 'present', "note" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0a47908a8a405f82595b678f9e1" UNIQUE ("session_id", "student_id"), CONSTRAINT "PK_946920332f5bc9efad3f3023b96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attendance_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_id" uuid NOT NULL, "date" date NOT NULL, "teacher_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2cd9990dd46c63438ee8b52f4e" UNIQUE ("class_id", "date"), CONSTRAINT "PK_84d565d9e484e2bcdaf4a9e1890" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_targets" ADD CONSTRAINT "FK_ebf6f50e017925224dec16f3964" FOREIGN KEY ("homework_id") REFERENCES "homeworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_targets" ADD CONSTRAINT "FK_3445523c0e6436eec7251c4ea70" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "homeworks" ADD CONSTRAINT "FK_f5b009c43250ffbd1bfcca27938" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "homeworks" ADD CONSTRAINT "FK_c7fae998f0ee81c7f3f013bd1ab" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_submissions" ADD CONSTRAINT "FK_f53e5ae262ff2280a092dff54bb" FOREIGN KEY ("homework_id") REFERENCES "homeworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_submissions" ADD CONSTRAINT "FK_1397103587dce2c2320ee2c2f23" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_submissions" ADD CONSTRAINT "FK_02a334c4b12d411b99a34bdf62c" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_records" ADD CONSTRAINT "FK_c51be2c1149e22de76b17626cb7" FOREIGN KEY ("session_id") REFERENCES "attendance_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_records" ADD CONSTRAINT "FK_dbace05c012526710663f8d8911" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_sessions" ADD CONSTRAINT "FK_6fc552e07b31ac92445cd3e21fa" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_sessions" ADD CONSTRAINT "FK_25fd57dbd4ef0d8db3dbe9457fb" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attendance_sessions" DROP CONSTRAINT "FK_25fd57dbd4ef0d8db3dbe9457fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_sessions" DROP CONSTRAINT "FK_6fc552e07b31ac92445cd3e21fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_records" DROP CONSTRAINT "FK_dbace05c012526710663f8d8911"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance_records" DROP CONSTRAINT "FK_c51be2c1149e22de76b17626cb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_submissions" DROP CONSTRAINT "FK_02a334c4b12d411b99a34bdf62c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_submissions" DROP CONSTRAINT "FK_1397103587dce2c2320ee2c2f23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_submissions" DROP CONSTRAINT "FK_f53e5ae262ff2280a092dff54bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homeworks" DROP CONSTRAINT "FK_c7fae998f0ee81c7f3f013bd1ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homeworks" DROP CONSTRAINT "FK_f5b009c43250ffbd1bfcca27938"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_targets" DROP CONSTRAINT "FK_3445523c0e6436eec7251c4ea70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "homework_targets" DROP CONSTRAINT "FK_ebf6f50e017925224dec16f3964"`,
    );
    await queryRunner.query(`DROP TABLE "attendance_sessions"`);
    await queryRunner.query(`DROP TABLE "attendance_records"`);
    await queryRunner.query(
      `DROP TYPE "public"."attendance_records_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "homework_submissions"`);
    await queryRunner.query(
      `DROP TYPE "public"."homework_submissions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "homeworks"`);
    await queryRunner.query(`DROP TYPE "public"."homeworks_target_scope_enum"`);
    await queryRunner.query(`DROP TYPE "public"."homeworks_type_enum"`);
    await queryRunner.query(`DROP TABLE "homework_targets"`);
  }
}
