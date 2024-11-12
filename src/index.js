import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import config from './config/index.js';
import authRoutes from './routes/auth.js';
import torrentRoutes from './routes/torrents.js';
import torrentManager from './services/TorrentManager.js';
import { errorHandler } from './utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/torrents', torrentRoutes);

// Error handling
app.use(errorHandler);

// Create downloads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync(config.storage.downloadPath)) {
  fs.mkdirSync(config.storage.downloadPath, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port} in ${config.server.env} mode`);
});