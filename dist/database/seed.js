"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = require("dotenv");
const bcrypt = require("bcrypt");
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../common/enums/role.enum");
const user_entity_1 = require("../modules/users/entities/user.entity");
const shift_entity_1 = require("../modules/shifts/entities/shift.entity");
(0, dotenv_1.config)();
async function seed() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [user_entity_1.User, shift_entity_1.Shift],
        synchronize: false,
    });
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const shiftRepo = dataSource.getRepository(shift_entity_1.Shift);
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
        const existing = await userRepo.findOne({ where: { email: adminEmail } });
        if (!existing) {
            const admin = userRepo.create({
                email: adminEmail,
                password: await bcrypt.hash(adminPassword, 10),
                name: 'Admin',
                role: role_enum_1.Role.ADMIN,
            });
            await userRepo.save(admin);
            process.stdout.write(`Seeded admin user: ${adminEmail}\n`);
        }
    }
    const shiftCount = await shiftRepo.count();
    if (shiftCount === 0) {
        await shiftRepo.save([
            shiftRepo.create({
                name: 'Ca 1',
                startTime: '08:00:00',
                endTime: '10:00:00',
            }),
            shiftRepo.create({
                name: 'Ca 2',
                startTime: '10:15:00',
                endTime: '12:15:00',
            }),
            shiftRepo.create({
                name: 'Ca 3',
                startTime: '13:30:00',
                endTime: '15:30:00',
            }),
        ]);
        process.stdout.write('Seeded default shifts\n');
    }
    await dataSource.destroy();
}
seed().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`${message}\n`);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map