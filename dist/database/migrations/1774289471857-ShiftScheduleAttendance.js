"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftScheduleAttendance1774289471857 = void 0;
class ShiftScheduleAttendance1774289471857 {
    name = 'ShiftScheduleAttendance1774289471857';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "attendance_sessions" DROP CONSTRAINT "UQ_f2cd9990dd46c63438ee8b52f4e"`);
        await queryRunner.query(`CREATE TABLE "shifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3ef662f98036997809da8338d31" UNIQUE ("name"), CONSTRAINT "PK_84d692e367e4d6cdf045828768c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_id" uuid NOT NULL, "weekday" integer NOT NULL, "shift_id" uuid NOT NULL, "teacher_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_073bfa5ec30996e6846f5235c07" UNIQUE ("class_id", "weekday", "shift_id"), CONSTRAINT "PK_2300f700f17303f84f7f4df153b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" ADD "shift_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" ADD CONSTRAINT "UQ_be3a0916b1c8e8ce8dbcae2b01a" UNIQUE ("class_id", "date", "shift_id")`);
        await queryRunner.query(`ALTER TABLE "class_schedules" ADD CONSTRAINT "FK_8311cc83d9350de70f2a77e8c5e" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_schedules" ADD CONSTRAINT "FK_6087b3a96d1312b5de3524038db" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_schedules" ADD CONSTRAINT "FK_ecee5b7068cd5c579525803c44b" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" ADD CONSTRAINT "FK_62b495f5fdf5f58130ca8e65bbb" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "attendance_sessions" DROP CONSTRAINT "FK_62b495f5fdf5f58130ca8e65bbb"`);
        await queryRunner.query(`ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_ecee5b7068cd5c579525803c44b"`);
        await queryRunner.query(`ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_6087b3a96d1312b5de3524038db"`);
        await queryRunner.query(`ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_8311cc83d9350de70f2a77e8c5e"`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" DROP CONSTRAINT "UQ_be3a0916b1c8e8ce8dbcae2b01a"`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" DROP COLUMN "shift_id"`);
        await queryRunner.query(`DROP TABLE "class_schedules"`);
        await queryRunner.query(`DROP TABLE "shifts"`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" ADD CONSTRAINT "UQ_f2cd9990dd46c63438ee8b52f4e" UNIQUE ("class_id", "date")`);
    }
}
exports.ShiftScheduleAttendance1774289471857 = ShiftScheduleAttendance1774289471857;
//# sourceMappingURL=1774289471857-ShiftScheduleAttendance.js.map