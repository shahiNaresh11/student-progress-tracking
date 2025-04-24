import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const initSuperAdminUser = async () => {
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

    console.log(created ? '✅ SuperAdmin created' : 'ℹ️ SuperAdmin already exists');
};
