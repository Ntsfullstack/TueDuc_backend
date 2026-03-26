"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentActiveStudent1774288776522 = void 0;
class ParentActiveStudent1774288776522 {
    name = 'ParentActiveStudent1774288776522';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "active_student_id" uuid`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active_student_id"`);
    }
}
exports.ParentActiveStudent1774288776522 = ParentActiveStudent1774288776522;
//# sourceMappingURL=1774288776522-ParentActiveStudent.js.map