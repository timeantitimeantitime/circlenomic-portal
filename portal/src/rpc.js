const http = require('http');
const config = require('./config');

class RavenRPC {
  constructor() {
    this.id = 0;
    this.opts = config.ravend.rpc;
  }

  call(method, params = []) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        jsonrpc: '1.0',
        id: ++this.id,
        method,
        params,
      });

      const auth = Buffer.from(`${this.opts.user}:${this.opts.pass}`).toString('base64');

      const req = http.request({
        hostname: this.opts.host,
        port: this.opts.port,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
          'Content-Length': Buffer.byteLength(body),
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) reject(new Error(parsed.error.message));
            else resolve(parsed.result);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  async getBlockchainInfo() { return this.call('getblockchaininfo'); }
  async getBlockCount() { return this.call('getblockcount'); }
  async getBlockHash(height) { return this.call('getblockhash', [height]); }
  async getBlock(hash, verbosity = 1) { return this.call('getblock', [hash, verbosity]); }
  async getRawTransaction(txid, verbose = false) { return this.call('getrawtransaction', [txid, verbose]); }
  async getNewAddress(label, addressType = 'bech32') { return this.call('getnewaddress', [label, addressType]); }
  async getAddressInfo(address) { return this.call('getaddressinfo', [address]); }
  async sendToAddress(address, amount) { return this.call('sendtoaddress', [address, amount]); }
  async generateToAddress(blocks, address) { return this.call('generatetoaddress', [blocks, address]); }
  async getBalance() { return this.call('getbalance'); }
  async getUnconfirmedBalance() { return this.call('getunconfirmedbalance'); }
  async listUnspent(minconf = 1, maxconf = 9999999) { return this.call('listunspent', [minconf, maxconf]); }
  async getNetworkInfo() { return this.call('getnetworkinfo'); }
  async getMiningInfo() { return this.call('getmininginfo'); }

  async getBlockTxs(height) {
    const hash = await this.getBlockHash(height);
    const block = await this.getBlock(hash);
    return block.tx || [];
  }

  async isConnected() {
    try {
      await this.getBlockCount();
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new RavenRPC();
