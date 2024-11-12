import mongoose from 'mongoose';

const torrentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  magnetLink: {
    type: String,
    required: true
  },
  name: String,
  size: Number,
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['queued', 'downloading', 'completed', 'error'],
    default: 'queued'
  },
  files: [{
    name: String,
    path: String,
    size: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Torrent', torrentSchema);