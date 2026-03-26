"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuitionSalary1774290034514 = void 0;
class TuitionSalary1774290034514 {
    name = 'TuitionSalary1774290034514';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tuition_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "month" character(7) NOT NULL, "amount" numeric(12,0) NOT NULL, "paid_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "method" character varying(50), "note" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a538a62ececbd14fba37e7541b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_tuition_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "monthly_fee" numeric(12,0) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7f602206d03821fa594c6d4f1be" UNIQUE ("student_id"), CONSTRAINT "PK_0548c8ad016277870f8b307c90a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teacher_salary_rates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teacher_id" uuid NOT NULL, "shift_id" uuid NOT NULL, "amount_per_session" numeric(12,0) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f842207efdf0a844b81c360cbfe" UNIQUE ("teacher_id", "shift_id"), CONSTRAINT "PK_fb4ee218f566e7509a34024ab0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tuition_payments" ADD CONSTRAINT "FK_df2baa60b75012c6ec725e64348" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tuition_payments" ADD CONSTRAINT "FK_6e3a50a3180bc8cdc53490e4bf3" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_tuition_plans" ADD CONSTRAINT "FK_7f602206d03821fa594c6d4f1be" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher_salary_rates" ADD CONSTRAINT "FK_69ee12bbf8cef52bf15aa2c6f7b" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher_salary_rates" ADD CONSTRAINT "FK_2b426645e954f237070752a352a" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "teacher_salary_rates" DROP CONSTRAINT "FK_2b426645e954f237070752a352a"`);
        await queryRunner.query(`ALTER TABLE "teacher_salary_rates" DROP CONSTRAINT "FK_69ee12bbf8cef52bf15aa2c6f7b"`);
        await queryRunner.query(`ALTER TABLE "student_tuition_plans" DROP CONSTRAINT "FK_7f602206d03821fa594c6d4f1be"`);
        await queryRunner.query(`ALTER TABLE "tuition_payments" DROP CONSTRAINT "FK_6e3a50a3180bc8cdc53490e4bf3"`);
        await queryRunner.query(`ALTER TABLE "tuition_payments" DROP CONSTRAINT "FK_df2baa60b75012c6ec725e64348"`);
        await queryRunner.query(`DROP TABLE "teacher_salary_rates"`);
        await queryRunner.query(`DROP TABLE "student_tuition_plans"`);
        await queryRunner.query(`DROP TABLE "tuition_payments"`);
    }
}
exports.TuitionSalary1774290034514 = TuitionSalary1774290034514;
//# sourceMappingURL=1774290034514-TuitionSalary.js.map