import dotenv from 'dotenv';
import app from './app.js';
import pool from './configs/dbConfig.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const initializeAdminUser = async () => {
    if (process.env.DB_CONNECTION !== 'false') {
        try {
            const client = await pool.connect();
            console.log('✅ Database connected.');

            // Add any admin init logic here
            console.log('👤 Admin user initialized.');

            client.release();
        } catch (err) {
            console.error('❌ DB Init Error:', err.message);
        }
    } else {
        console.log('⏭️ Skipping DB init (disabled).');
    }
};

app.listen(PORT, async () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    await initializeAdminUser();
});
