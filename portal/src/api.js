const express = require('express');
const rpc = require('./rpc');
const daemon = require('./daemon');
const ubi = require('./ubi');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/api/status', async (req, res) => {
  try {
    const status = await daemon.getStatus();
    res.json({ circlenomic: 'v1.0.0', ...status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/blockchain', async (req, res) => {
  try {
    const info = await rpc.getBlockchainInfo();
    res.json(info);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/balances', async (req, res) => {
  try {
    const balances = await ubi.getPoolBalances();
    res.json(balances);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ubi/history', (req, res) => {
  res.json(ubi.getHistory());
});

app.get('/api/ubi/pending', (req, res) => {
  res.json(ubi.getPending());
});

app.post('/api/ubi/distribute', async (req, res) => {
  try {
    const result = await ubi.processPending();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ubi/config', (req, res) => {
  res.json({ addresses: config.addresses, splits: config.ubi });
});

app.post('/api/mine', async (req, res) => {
  try {
    const blocks = req.body.blocks || 1;
    const addr = req.body.address || config.addresses.miner;
    const result = await rpc.generateToAddress(blocks, addr);
    res.json({ mined: blocks, txids: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/education', (req, res) => {
  res.json({
    tasks: [
      { id: 1, name: 'Complete a crypto basics course', reward: 50, category: 'crypto' },
      { id: 2, name: 'Write a blog post about UBI', reward: 30, category: 'writing' },
      { id: 3, name: 'Attend a community governance call', reward: 20, category: 'governance' },
      { id: 4, name: 'Contribute to open source project', reward: 100, category: 'development' },
      { id: 5, name: 'Teach someone about blockchain', reward: 40, category: 'education' },
    ],
    bonusCapPercent: 50,
  });
});

app.get('/api/governance', (req, res) => {
  res.json({
    proposals: [],
    votingPower: {},
    quorum: 0.1,
  });
});

app.get('/api/marketplace', (req, res) => {
  res.json({
    listings: [],
    categories: ['services', 'education', 'goods', 'time-banking'],
  });
});

module.exports = app;
