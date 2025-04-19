// app.js
import express from 'express';

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

export default app;
