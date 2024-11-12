import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    expiresIn: '7d'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/seedbox'
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  storage: {
    maxStorageFree: parseInt(process.env.MAX_STORAGE_FREE, 10) || 2147483648,
    downloadPath: process.env.DOWNLOAD_PATH || './downloads',
    maxConcurrentDownloads: parseInt(process.env.MAX_CONCURRENT_DOWNLOADS, 10) || 3
  }
};

export default config;