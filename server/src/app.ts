import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Simple health route
app.get('/', (_req, res) => res.json({ status: 'ok' }));

export default app;
