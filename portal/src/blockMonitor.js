const EventEmitter = require('events');
const rpc = require('./rpc');
const config = require('./config');

class BlockMonitor extends EventEmitter {
  constructor() {
    super();
    this.lastHeight = -1;
    this.timer = null;
    this.running = false;
  }

  async start() {
    if (this.running) return;
    this.running = true;

    try {
      this.lastHeight = await rpc.getBlockCount();
      console.log(`[block-monitor] Starting at block ${this.lastHeight}`);
    } catch (e) {
      console.error('[block-monitor] Failed to get initial block count:', e.message);
      this.lastHeight = 0;
    }

    this.poll();
  }

  async poll() {
    if (!this.running) return;

    try {
      const currentHeight = await rpc.getBlockCount();
      if (currentHeight > this.lastHeight) {
        for (let h = this.lastHeight + 1; h <= currentHeight; h++) {
          const block = await rpc.getBlock(await rpc.getBlockHash(h), 2);
          console.log(`[block-monitor] New block #${h} (${block.hash.substring(0, 16)}...)`);
          this.emit('block', { height: h, block });
        }
        this.lastHeight = currentHeight;
      }
    } catch (e) {
      console.error('[block-monitor] Poll error:', e.message);
    }

    this.timer = setTimeout(() => this.poll(), config.pollIntervalMs);
  }

  stop() {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
  }
}

module.exports = new BlockMonitor();
