import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHomeworkComment1781631341329 implements MigrationInterface {
    name = 'UpdateHomeworkComment1781631341329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "homework_submission_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submission_id" uuid NOT NULL, "user_id" uuid NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0514c275db42bf6d0942d6df8de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "homework_submissions" DROP COLUMN "feedback"`);
        await queryRunner.query(`ALTER TABLE "homework_submission_comments" ADD CONSTRAINT "FK_b2f06371deb3c60744e008e1494" FOREIGN KEY ("submission_id") REFERENCES "homework_submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "homework_submission_comments" ADD CONSTRAINT "FK_7003ff8f46067d6e80cee313d38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "homework_submission_comments" DROP CONSTRAINT "FK_7003ff8f46067d6e80cee313d38"`);
        await queryRunner.query(`ALTER TABLE "homework_submission_comments" DROP CONSTRAINT "FK_b2f06371deb3c60744e008e1494"`);
        await queryRunner.query(`ALTER TABLE "homework_submissions" ADD "feedback" text`);
        await queryRunner.query(`DROP TABLE "homework_submission_comments"`);
    }

}
