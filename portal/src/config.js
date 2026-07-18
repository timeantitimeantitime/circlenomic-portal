const path = require('path');

module.exports = {
  ravend: {
    bin: path.resolve(__dirname, '../../mining-layer/bin/ravend'),
    cli: path.resolve(__dirname, '../../mining-layer/bin/raven-cli'),
    datadir: path.resolve(__dirname, '../.raven'),
    rpc: {
      host: '127.0.0.1',
      port: 8766,
      user: 'circlenomic',
      pass: 'circlenomic2026',
    },
    zmq: {
      rawblock: 'tcp://127.0.0.1:28332',
      rawtx: 'tcp://127.0.0.1:28333',
    },
  },
  api: {
    port: 3000,
  },
  ubi: {
    minerPercent: 40,
    ubiPoolPercent: 30,
    communityPercent: 20,
    devFundPercent: 10,
  },
  addresses: {
    miner: 'n176iU2wEeQvpdLHVy6aR5SqTGdQWN2ajd',
    ubiPool: 'moeSCniyFjwTLs29keJfiHyRdJ89VVmBBB',
    communityTreasury: 'n4b6DrJKtd8m3FptVEtBWFZgLrTpRXZvvM',
    devFund: 'myLL2RptddSrWUnAYK5Ry8Ubc9E8PsUBrX',
  },
  pollIntervalMs: 5000,
};
