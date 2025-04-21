// seeders/seedUsers.js
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';

dotenv.config();

// Optional: init sequelize connection here if not globally done
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
    }
);

const seed = async () => {
    try {
        await sequelize.sync();

        const hashedPassword = await bcrypt.hash('password123', 10);

        const [user, created] = await User.findOrCreate({
            where: { email: 'naresh@example.com' },
            defaults: {
                name: 'Naresh Shahi',
                email: 'naresh@example.com',
                password: hashedPassword,
                phone: '9800000000',
                address: 'Nepal',
                role: 'SUPERADMIN',

            },
        });

        if (created) {
            console.log('✅ User seeded successfully');
        } else {
            console.log('ℹ️ User already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding user:', error);
        process.exit(1);
    }
};

seed();
