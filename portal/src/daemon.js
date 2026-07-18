const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const rpc = require('./rpc');
const config = require('./config');

class DaemonManager {
  constructor() {
    this.process = null;
    this.state = 'stopped';
  }

  async start() {
    if (this.process) return { status: 'already running' };

    const rpcOk = await rpc.isConnected().catch(() => false);
    if (rpcOk) {
      this.state = 'running';
      return { status: 'connected to existing daemon' };
    }

    if (!fs.existsSync(config.ravend.datadir)) {
      fs.mkdirSync(config.ravend.datadir, { recursive: true });
    }

    const confFile = path.join(config.ravend.datadir, 'raven.conf');
    if (!fs.existsSync(confFile)) {
      fs.writeFileSync(confFile, [
        'server=1',
        `rpcuser=${config.ravend.rpc.user}`,
        `rpcpassword=${config.ravend.rpc.pass}`,
        'rpcallowip=127.0.0.1',
        `rpcport=${config.ravend.rpc.port}`,
        'listen=1',
        'txindex=1',
        'addressindex=1',
        'timestampindex=1',
        'spentindex=1',
        `zmqpubrawblock=${config.ravend.zmq.rawblock}`,
        `zmqpubrawtx=${config.ravend.zmq.rawtx}`,
      ].join('\n'));
    }

    this.state = 'starting';
    this.process = spawn(config.ravend.bin, [
      `-datadir=${config.ravend.datadir}`,
      '-daemon',
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PATH: '/usr/local/bin:' + process.env.PATH },
    });

    this.process.stdout.on('data', (d) => console.log('[ravend]', d.toString().trim()));
    this.process.stderr.on('data', (d) => console.error('[ravend]', d.toString().trim()));

    this.process.on('exit', (code) => {
      console.log(`[ravend] exited with code ${code}`);
      this.process = null;
      this.state = 'stopped';
    });

    await this.waitForRPC();
    this.state = 'running';
    return { status: 'started' };
  }

  async stop() {
    if (!this.process) return { status: 'not running' };
    try {
      await rpc.call('stop');
      this.state = 'stopping';
      await new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(), 10000);
        this.process.on('exit', () => { clearTimeout(timeout); resolve(); });
      });
    } catch {
      this.process.kill('SIGTERM');
    }
    this.process = null;
    this.state = 'stopped';
    return { status: 'stopped' };
  }

  async waitForRPC(timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        await rpc.getBlockCount();
        return true;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    throw new Error('RPC not available after timeout');
  }

  async getStatus() {
    const connected = await rpc.isConnected();
    let blockCount = 0;
    let chain = '';
    if (connected) {
      blockCount = await rpc.getBlockCount();
      const info = await rpc.getBlockchainInfo();
      chain = info.chain;
    }
    return {
      running: this.state,
      connected,
      blockCount,
      chain,
    };
  }
}

module.exports = new DaemonManager();
