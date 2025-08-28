import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import { seedAdminIfNeeded } from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Hospital Registration API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'hospital_reg' });
    console.log('Connected to MongoDB');
    await seedAdminIfNeeded();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
};

start();
