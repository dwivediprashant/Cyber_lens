import express from 'express';
import cors from 'cors';
import resolveOwner from './utils/resolveOwner';
import routes from './routes';


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(resolveOwner);


// Simple health route
app.get('/', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/', routes);

export default app;
