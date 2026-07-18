const rpc = require('./rpc');
const config = require('./config');

const BLOCK_REWARD = 5000;
const COIN_MATURITY = 100;

class UBIDistribution {
  constructor() {
    this.distributed = [];
    this.pendingDistributions = [];
  }

  async processBlock({ height, block }) {
    const coinbase = this.extractCoinbase(block);
    if (!coinbase) {
      console.log(`[ubi] Block #${height}: no coinbase found, skipping`);
      return null;
    }

    const totalReward = coinbase.value;
    const splits = this.calculateSplits(totalReward);

    console.log(`[ubi] Block #${height}: ${totalReward} RVN total`);
    console.log(`  Miner (${config.ubi.minerPercent}%): ${splits.miner} → ${config.addresses.miner}`);
    console.log(`  UBI (${config.ubi.ubiPoolPercent}%): ${splits.ubiPool} → ${config.addresses.ubiPool}`);
    console.log(`  Community (${config.ubi.communityPercent}%): ${splits.community} → ${config.addresses.communityTreasury}`);
    console.log(`  Dev (${config.ubi.devFundPercent}%): ${splits.devFund} → ${config.addresses.devFund}`);

    this.pendingDistributions.push({ height, splits, timestamp: Date.now() });

    const results = await this.processPending();
    return { height, totalReward, splits, ...results };
  }

  extractCoinbase(block) {
    if (!block.tx || block.tx.length === 0) return null;
    const tx = block.tx[0];
    const txid = typeof tx === 'string' ? tx : tx.txid;
    const value = tx.vout ? tx.vout.reduce((s, o) => s + o.value, 0) : BLOCK_REWARD;
    return { txid, value };
  }

  calculateSplits(totalReward) {
    const p = config.ubi;
    const miner = totalReward * p.minerPercent / 100;
    const ubiPool = totalReward * p.ubiPoolPercent / 100;
    const community = totalReward * p.communityPercent / 100;
    const devFund = totalReward - miner - ubiPool - community;
    return {
      miner: Math.round(miner * 1e8) / 1e8,
      ubiPool: Math.round(ubiPool * 1e8) / 1e8,
      community: Math.round(community * 1e8) / 1e8,
      devFund: Math.round(devFund * 1e8) / 1e8,
    };
  }

  async processPending() {
    if (this.pendingDistributions.length === 0) return { distributed: [] };

    let balance;
    try {
      balance = await rpc.getBalance();
    } catch (e) {
      return { distributed: [], error: e.message };
    }

    if (balance < 1) {
      return { distributed: [], reason: 'insufficient mature balance' };
    }

    const toProcess = [...this.pendingDistributions];
    this.pendingDistributions = [];
    const distributed = [];

    for (const pending of toProcess) {
      try {
        const txids = await this.distribute(pending.splits);
        const record = {
          height: pending.height,
          splits: pending.splits,
          txids,
          timestamp: pending.timestamp,
        };
        this.distributed.push(record);
        distributed.push(record);
        console.log(`[ubi] Distributed for block #${pending.height}`);
      } catch (e) {
        console.error(`[ubi] Distribution failed for block #${pending.height}: ${e.message}`);
        this.pendingDistributions.push(pending);
      }
    }

    return { distributed };
  }

  async distribute(splits) {
    const txids = [];
    const tx1 = await rpc.sendToAddress(config.addresses.miner, splits.miner);
    txids.push({ label: 'miner', txid: tx1 });
    const tx2 = await rpc.sendToAddress(config.addresses.ubiPool, splits.ubiPool);
    txids.push({ label: 'ubiPool', txid: tx2 });
    const tx3 = await rpc.sendToAddress(config.addresses.communityTreasury, splits.community);
    txids.push({ label: 'community', txid: tx3 });
    const tx4 = await rpc.sendToAddress(config.addresses.devFund, splits.devFund);
    txids.push({ label: 'devFund', txid: tx4 });
    return txids;
  }

  getHistory() {
    return this.distributed;
  }

  getPending() {
    return this.pendingDistributions;
  }

  async getPoolBalances() {
    const balances = {};
    const unspent = await rpc.listUnspent(0, 9999999).catch(() => []);
    for (const [label, addr] of Object.entries(config.addresses)) {
      const addrUtxos = unspent.filter((u) => u.address === addr);
      const balance = addrUtxos.reduce((s, u) => s + u.amount, 0);
      const confirmed = addrUtxos.filter((u) => u.confirmations > 0).reduce((s, u) => s + u.amount, 0);
      const unconfirmed = addrUtxos.filter((u) => u.confirmations === 0).reduce((s, u) => s + u.amount, 0);
      balances[label] = { address: addr, balance, confirmed, unconfirmed, utxoCount: addrUtxos.length };
    }
    return balances;
  }
}

module.exports = new UBIDistribution();
