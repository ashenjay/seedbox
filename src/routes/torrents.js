import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addTorrent, getTorrentStream } from '../controllers/torrentController.js';
import Torrent from '../models/Torrent.js';
import queueManager from '../services/QueueManager.js';
import torrentManager from '../services/TorrentManager.js';
import { ApiError } from '../utils/errors.js';

const router = express.Router();

router.post('/add', authenticateToken, async (req, res, next) => {
  try {
    const { magnetLink } = req.body;
    const torrent = await addTorrent(req.user.userId, magnetLink);
    queueManager.add(torrent);
    res.status(201).json(torrent);
  } catch (error) {
    next(error);
  }
});

router.get('/list', authenticateToken, async (req, res, next) => {
  try {
    const torrents = await Torrent.find({ userId: req.user.userId });
    res.json(torrents);
  } catch (error) {
    next(error);
  }
});

router.get('/stream/:torrentId/:fileIndex?', authenticateToken, async (req, res, next) => {
  try {
    const { torrentId, fileIndex = 0 } = req.params;
    const file = await getTorrentStream(torrentId, req.user.userId, parseInt(fileIndex));
    
    const range = req.headers.range;
    if (!range) {
      const stream = file.createReadStream();
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', file.length);
      return stream.pipe(res);
    }

    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const end = positions[1] ? parseInt(positions[1], 10) : file.length - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${file.length}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'application/octet-stream',
    });

    const stream = file.createReadStream({ start, end });
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const torrent = await Torrent.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!torrent) {
      throw new ApiError(404, 'Torrent not found');
    }

    torrentManager.removeTorrent(torrent.magnetLink);
    queueManager.remove(torrent._id);
    await torrent.deleteOne();
    
    res.json({ message: 'Torrent removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;