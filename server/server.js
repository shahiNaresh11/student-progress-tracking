import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './configs/dbConfig.js';
import { initSuperAdminUser } from './utils/initSuperAdmin.js';
import { v2 as cloudinary } from 'cloudinary';
import './models/index.model.js';

dotenv.config();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate(); // ✅ DB connection check
        await sequelize.sync({ alter: true }); // ✅ auto update tables with model fields
        await initSuperAdminUser(); // ✅ seed super admin user
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    } catch (err) {
        console.error('❌ DB Connection Failed:', err.message);
    }
});
