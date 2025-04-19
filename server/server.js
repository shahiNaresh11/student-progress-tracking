// index.js
import app from './app.js';
// import connectToDB from './configs/dbConn.js'; // Commented out to skip DB connection

const PORT = process.env.PORT || 5000;

const initializeAdminUser = () => {
    if (process.env.DB_CONNECTION !== 'false') {
        // Mock logic for DB-dependent user initialization
        console.log("Admin user initialized with DB.");
    } else {
        console.log("Skipping admin user initialization.");
    }
};

app.listen(PORT, async () => {
    // Conditionally connect to DB (commented out to skip DB)
    // await connectToDB(); // Database connection is skipped
    console.log("Database connection skipped."); // Inform that DB is not being connected

    initializeAdminUser(); // Admin user initialization logic
    console.log(`App is running at http://localhost:${PORT}`);
});

