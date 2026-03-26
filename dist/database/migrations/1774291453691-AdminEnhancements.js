"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEnhancements1774291453691 = void 0;
class AdminEnhancements1774291453691 {
    name = 'AdminEnhancements1774291453691';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "attendance_edit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_id" uuid NOT NULL, "editor_id" uuid NOT NULL, "reason" text, "before" jsonb NOT NULL, "after" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_84d434ff40e7f2ba8b185a55e5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE TYPE "public"."classes_status_enum" AS ENUM('open', 'closed', 'paused')`);
        await queryRunner.query(`ALTER TABLE "classes" ADD "status" "public"."classes_status_enum" NOT NULL DEFAULT 'open'`);
        await queryRunner.query(`ALTER TABLE "classes" ADD "max_students" integer`);
        await queryRunner.query(`ALTER TABLE "classes" ADD "archived_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "classes" ADD "cloned_from_id" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."students_status_enum" AS ENUM('active', 'paused', 'stopped')`);
        await queryRunner.query(`ALTER TABLE "students" ADD "status" "public"."students_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "attendance_edit_logs" ADD CONSTRAINT "FK_8009ea96483e19d4fe7c807591d" FOREIGN KEY ("session_id") REFERENCES "attendance_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance_edit_logs" ADD CONSTRAINT "FK_f2d4fa131ca3a9cd6fae2d50c3a" FOREIGN KEY ("editor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "attendance_edit_logs" DROP CONSTRAINT "FK_f2d4fa131ca3a9cd6fae2d50c3a"`);
        await queryRunner.query(`ALTER TABLE "attendance_edit_logs" DROP CONSTRAINT "FK_8009ea96483e19d4fe7c807591d"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."students_status_enum"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "cloned_from_id"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "archived_at"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "max_students"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."classes_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`DROP TABLE "attendance_edit_logs"`);
    }
}
exports.AdminEnhancements1774291453691 = AdminEnhancements1774291453691;
//# sourceMappingURL=1774291453691-AdminEnhancements.js.map