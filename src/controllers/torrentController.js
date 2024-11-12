import Torrent from '../models/Torrent.js';
import User from '../models/User.js';
import { ApiError } from '../utils/errors.js';

export const addTorrent = async (userId, magnetLink) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const torrent = new Torrent({
    userId,
    magnetLink,
    status: 'queued'
  });
  await torrent.save();
  
  return torrent;
};

export const updateTorrentStatus = async (torrentId, updates) => {
  const torrent = await Torrent.findByIdAndUpdate(
    torrentId,
    { $set: updates },
    { new: true }
  );
  return torrent;
};

export const getTorrentStream = async (torrentId, userId, fileIndex = 0) => {
  const torrent = await Torrent.findOne({ _id: torrentId, userId });
  if (!torrent) {
    throw new ApiError(404, 'Torrent not found');
  }

  const webTorrent = global.webTorrentClient.get(torrent.magnetLink);
  if (!webTorrent) {
    throw new ApiError(404, 'Torrent not found in client');
  }

  const file = webTorrent.files[fileIndex];
  if (!file) {
    throw new ApiError(404, 'File not found');
  }

  return file;
};