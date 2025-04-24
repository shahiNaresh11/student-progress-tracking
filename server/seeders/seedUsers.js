import sequelize from '../configs/dbConfig.js';
import { initSuperAdminUser } from '../utils/initSuperAdmin.js';

const seed = async () => {
  try {
    await sequelize.sync({ alter: true }); // or force: true if resetting

    await initSuperAdminUser();

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
