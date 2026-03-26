import 'reflect-metadata';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { User } from '../modules/users/entities/user.entity';
import { Shift } from '../modules/shifts/entities/shift.entity';

config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Shift],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const shiftRepo = dataSource.getRepository(Shift);

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await userRepo.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const admin = userRepo.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: 'Admin',
        role: Role.ADMIN,
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

seed().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
