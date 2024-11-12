import WebTorrent from 'webtorrent';
import queueManager from './QueueManager.js';
import { updateTorrentStatus } from '../controllers/torrentController.js';

class TorrentManager {
  constructor() {
    this.client = new WebTorrent();
    this.setupQueueListener();
  }

  setupQueueListener() {
    queueManager.on('process', (torrent) => {
      this.startDownload(torrent);
    });
  }

  async startDownload(torrentData) {
    try {
      this.client.add(torrentData.magnetLink, { path: './downloads' }, async (torrent) => {
        await updateTorrentStatus(torrentData.id, {
          status: 'downloading',
          name: torrent.name,
          size: torrent.length
        });

        torrent.on('download', async (bytes) => {
          await updateTorrentStatus(torrentData.id, {
            progress: torrent.progress,
            downloadSpeed: torrent.downloadSpeed
          });
        });

        torrent.on('done', async () => {
          await updateTorrentStatus(torrentData.id, {
            status: 'completed',
            progress: 1
          });
          queueManager.complete(torrentData.id);
        });

        torrent.on('error', async (err) => {
          await updateTorrentStatus(torrentData.id, {
            status: 'error',
            error: err.message
          });
          queueManager.complete(torrentData.id);
        });
      });
    } catch (error) {
      await updateTorrentStatus(torrentData.id, {
        status: 'error',
        error: error.message
      });
      queueManager.complete(torrentData.id);
    }
  }

  removeTorrent(magnetLink) {
    const torrent = this.client.get(magnetLink);
    if (torrent) {
      torrent.destroy();
    }
  }
}

export default new TorrentManager();