import EventEmitter from 'events';

class QueueManager extends EventEmitter {
  constructor(maxConcurrent = 3) {
    super();
    this.queue = [];
    this.active = new Set();
    this.maxConcurrent = maxConcurrent;
  }

  add(torrent) {
    this.queue.push(torrent);
    this.processQueue();
  }

  remove(torrentId) {
    this.queue = this.queue.filter(t => t.id !== torrentId);
    this.active.delete(torrentId);
    this.processQueue();
  }

  processQueue() {
    while (this.active.size < this.maxConcurrent && this.queue.length > 0) {
      const torrent = this.queue.shift();
      this.active.add(torrent.id);
      this.emit('process', torrent);
    }
  }

  complete(torrentId) {
    this.active.delete(torrentId);
    this.processQueue();
  }
}

export default new QueueManager();