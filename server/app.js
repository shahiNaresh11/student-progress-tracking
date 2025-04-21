import express from 'express';
import userRoutes from './routes/user.routes.js';
import cors from 'cors'
// import AppError from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

// Routes
app.use('/api/v1/user', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

export default app;
